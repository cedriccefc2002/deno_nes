enum MODE {
  NORMAL = 0,
  LOOP = 1,
  IRQ = 2,
}
export class ChannelDM {
  isEnabled = false;
  hasSample = false;
  irqGenerated = false;
  playMode = MODE.NORMAL;
  dmaFrequency = 0;
  dmaCounter = 0;
  deltaCounter = 0;
  playStartAddress = 0;
  playAddress = 0;
  playLength = 0;
  playLengthCounter = 0;
  shiftCounter = 0;
  reg4012 = 0;
  reg4013 = 0;
  sample = 0;
  dacLsb = 0;
  data = 0;
  constructor(private papu: any) {
    this.reset();
  }

  clockDmc() {
    // Only alter DAC value if the sample buffer has data:
    if (this.hasSample) {
      if ((this.data & 1) === 0) {
        // Decrement delta:
        if (this.deltaCounter > 0) {
          this.deltaCounter--;
        }
      } else {
        // Increment delta:
        if (this.deltaCounter < 63) {
          this.deltaCounter++;
        }
      }

      // Update sample value:
      this.sample = this.isEnabled ? (this.deltaCounter << 1) + this.dacLsb : 0;

      // Update shift register:
      this.data >>= 1;
    }

    this.dmaCounter--;
    if (this.dmaCounter <= 0) {
      // No more sample bits.
      this.hasSample = false;
      this.endOfSample();
      this.dmaCounter = 8;
    }

    if (this.irqGenerated) {
      this.papu.nes.cpu.requestIrq(this.papu.nes.cpu.IRQ_NORMAL);
    }
  }

  endOfSample() {
    if (this.playLengthCounter === 0 && this.playMode === MODE.LOOP) {
      // Start from beginning of sample:
      this.playAddress = this.playStartAddress;
      this.playLengthCounter = this.playLength;
    }

    if (this.playLengthCounter > 0) {
      // Fetch next sample:
      this.nextSample();

      if (this.playLengthCounter === 0) {
        // Last byte of sample fetched, generate IRQ:
        if (this.playMode === MODE.IRQ) {
          // Generate IRQ:
          this.irqGenerated = true;
        }
      }
    }
  }

  nextSample() {
    // Fetch byte:
    this.data = this.papu.nes.mmap.load(this.playAddress);
    this.papu.nes.cpu.haltCycles(4);

    this.playLengthCounter--;
    this.playAddress++;
    if (this.playAddress > 0xffff) {
      this.playAddress = 0x8000;
    }

    this.hasSample = true;
  }

  writeReg(address: number, value: number) {
    if (address === 0x4010) {
      // Play mode, DMA Frequency
      if (value >> 6 === 0) {
        this.playMode = MODE.NORMAL;
      } else if (((value >> 6) & 1) === 1) {
        this.playMode = MODE.LOOP;
      } else if (value >> 6 === 2) {
        this.playMode = MODE.IRQ;
      }

      if ((value & 0x80) === 0) {
        this.irqGenerated = false;
      }

      this.dmaFrequency = this.papu.getDmcFrequency(value & 0xf);
    } else if (address === 0x4011) {
      // Delta counter load register:
      this.deltaCounter = (value >> 1) & 63;
      this.dacLsb = value & 1;
      this.sample = (this.deltaCounter << 1) + this.dacLsb; // update sample value
    } else if (address === 0x4012) {
      // DMA address load register
      this.playStartAddress = (value << 6) | 0x0c000;
      this.playAddress = this.playStartAddress;
      this.reg4012 = value;
    } else if (address === 0x4013) {
      // Length of play code
      this.playLength = (value << 4) + 1;
      this.playLengthCounter = this.playLength;
      this.reg4013 = value;
    } else if (address === 0x4015) {
      // DMC/IRQ Status
      if (((value >> 4) & 1) === 0) {
        // Disable:
        this.playLengthCounter = 0;
      } else {
        // Restart:
        this.playAddress = this.playStartAddress;
        this.playLengthCounter = this.playLength;
      }
      this.irqGenerated = false;
    }
  }

  setEnabled(value: boolean) {
    if (!this.isEnabled && value) {
      this.playLengthCounter = this.playLength;
    }
    this.isEnabled = value;
  }

  getLengthStatus() {
    return this.playLengthCounter === 0 || !this.isEnabled ? 0 : 1;
  }

  getIrqStatus() {
    return this.irqGenerated ? 1 : 0;
  }

  reset() {
    this.isEnabled = false;
    this.irqGenerated = false;
    this.playMode = MODE.NORMAL;
    this.dmaFrequency = 0;
    this.dmaCounter = 0;
    this.deltaCounter = 0;
    this.playStartAddress = 0;
    this.playAddress = 0;
    this.playLength = 0;
    this.playLengthCounter = 0;
    this.sample = 0;
    this.dacLsb = 0;
    this.shiftCounter = 0;
    this.reg4012 = 0;
    this.reg4013 = 0;
    this.data = 0;
  }
}

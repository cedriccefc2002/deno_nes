export class ChannelSquare {
    // prettier-ignore
    dutyLookup = [
        0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        1, 0, 0, 1, 1, 1, 1, 1
    ];
    // prettier-ignore
    impLookup = [
        1, -1, 0, 0, 0, 0, 0, 0,
        1, 0, -1, 0, 0, 0, 0, 0,
        1, 0, 0, 0, -1, 0, 0, 0,
        -1, 0, 1, 0, 0, 0, 0, 0
    ];

    isEnabled = false;
    lengthCounterEnable = false;
    sweepActive = false;
    envDecayDisable = false;
    envDecayLoopEnable = false;
    envReset = false;
    sweepCarry = false;
    updateSweepPeriod = false;

    progTimerCount = 0;
    progTimerMax = 0;
    lengthCounter = 0;
    squareCounter = 0;
    sweepCounter = 0;
    sweepCounterMax = 0;
    sweepMode = 0;
    sweepShiftAmount = 0;
    envDecayRate = 0;
    envDecayCounter = 0;
    envVolume = 0;
    masterVolume = 0;
    dutyMode = 0;
    sweepResult = null;
    sampleValue = 0;
    vol = 0;
    constructor(private papu: any, private sqr1: any) {
        this.reset();
    }
    reset() {
        this.progTimerCount = 0;
        this.progTimerMax = 0;
        this.lengthCounter = 0;
        this.squareCounter = 0;
        this.sweepCounter = 0;
        this.sweepCounterMax = 0;
        this.sweepMode = 0;
        this.sweepShiftAmount = 0;
        this.envDecayRate = 0;
        this.envDecayCounter = 0;
        this.envVolume = 0;
        this.masterVolume = 0;
        this.dutyMode = 0;
        this.vol = 0;

        this.isEnabled = false;
        this.lengthCounterEnable = false;
        this.sweepActive = false;
        this.sweepCarry = false;
        this.envDecayDisable = false;
        this.envDecayLoopEnable = false;
    }
    clockLengthCounter() {
        if (this.lengthCounterEnable && this.lengthCounter > 0) {
            this.lengthCounter--;
            if (this.lengthCounter === 0) {
                this.updateSampleValue();
            }
        }
    }

    clockEnvDecay() {
        if (this.envReset) {
            // Reset envelope:
            this.envReset = false;
            this.envDecayCounter = this.envDecayRate + 1;
            this.envVolume = 0xf;
        } else if (--this.envDecayCounter <= 0) {
            // Normal handling:
            this.envDecayCounter = this.envDecayRate + 1;
            if (this.envVolume > 0) {
                this.envVolume--;
            } else {
                this.envVolume = this.envDecayLoopEnable ? 0xf : 0;
            }
        }

        if (this.envDecayDisable) {
            this.masterVolume = this.envDecayRate;
        } else {
            this.masterVolume = this.envVolume;
        }
        this.updateSampleValue();
    }

    clockSweep() {
        if (--this.sweepCounter <= 0) {
            this.sweepCounter = this.sweepCounterMax + 1;
            if (
                this.sweepActive &&
                this.sweepShiftAmount > 0 &&
                this.progTimerMax > 7
            ) {
                // Calculate result from shifter:
                this.sweepCarry = false;
                if (this.sweepMode === 0) {
                    this.progTimerMax += this.progTimerMax >> this.sweepShiftAmount;
                    if (this.progTimerMax > 4095) {
                        this.progTimerMax = 4095;
                        this.sweepCarry = true;
                    }
                } else {
                    this.progTimerMax =
                        this.progTimerMax -
                        ((this.progTimerMax >> this.sweepShiftAmount) -
                            (this.sqr1 ? 1 : 0));
                }
            }
        }

        if (this.updateSweepPeriod) {
            this.updateSweepPeriod = false;
            this.sweepCounter = this.sweepCounterMax + 1;
        }
    }

    updateSampleValue() {
        if (this.isEnabled && this.lengthCounter > 0 && this.progTimerMax > 7) {
            if (
                this.sweepMode === 0 &&
                this.progTimerMax + (this.progTimerMax >> this.sweepShiftAmount) > 4095
            ) {
                //if (this.sweepCarry) {
                this.sampleValue = 0;
            } else {
                this.sampleValue =
                    this.masterVolume *
                    this.dutyLookup[(this.dutyMode << 3) + this.squareCounter];
            }
        } else {
            this.sampleValue = 0;
        }
    }

    writeReg(address: number, value: number) {
        var addrAdd = this.sqr1 ? 0 : 4;
        if (address === 0x4000 + addrAdd) {
            // Volume/Envelope decay:
            this.envDecayDisable = (value & 0x10) !== 0;
            this.envDecayRate = value & 0xf;
            this.envDecayLoopEnable = (value & 0x20) !== 0;
            this.dutyMode = (value >> 6) & 0x3;
            this.lengthCounterEnable = (value & 0x20) === 0;
            if (this.envDecayDisable) {
                this.masterVolume = this.envDecayRate;
            } else {
                this.masterVolume = this.envVolume;
            }
            this.updateSampleValue();
        } else if (address === 0x4001 + addrAdd) {
            // Sweep:
            this.sweepActive = (value & 0x80) !== 0;
            this.sweepCounterMax = (value >> 4) & 7;
            this.sweepMode = (value >> 3) & 1;
            this.sweepShiftAmount = value & 7;
            this.updateSweepPeriod = true;
        } else if (address === 0x4002 + addrAdd) {
            // Programmable timer:
            this.progTimerMax &= 0x700;
            this.progTimerMax |= value;
        } else if (address === 0x4003 + addrAdd) {
            // Programmable timer, length counter
            this.progTimerMax &= 0xff;
            this.progTimerMax |= (value & 0x7) << 8;

            if (this.isEnabled) {
                this.lengthCounter = this.papu.getLengthMax(value & 0xf8);
            }

            this.envReset = true;
        }
    }

    setEnabled(value: boolean) {
        this.isEnabled = value;
        if (!value) {
            this.lengthCounter = 0;
        }
        this.updateSampleValue();
    }

    getLengthStatus() {
        return this.lengthCounter === 0 || !this.isEnabled ? 0 : 1;
    }
}
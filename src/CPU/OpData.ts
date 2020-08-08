enum INS {
    ADC = 0,
    AND = 1,
    ASL = 2,

    BCC = 3,
    BCS = 4,
    BEQ = 5,
    BIT = 6,
    BMI = 7,
    BNE = 8,
    BPL = 9,
    BRK = 10,
    BVC = 11,
    BVS = 12,

    CLC = 13,
    CLD = 14,
    CLI = 15,
    CLV = 16,
    CMP = 17,
    CPX = 18,
    CPY = 19,

    DEC = 20,
    DEX = 21,
    DEY = 22,

    EOR = 23,

    INC = 24,
    INX = 25,
    INY = 26,

    JMP = 27,
    JSR = 28,

    LDA = 29,
    LDX = 30,
    LDY = 31,
    LSR = 32,

    NOP = 33,

    ORA = 34,

    PHA = 35,
    PHP = 36,
    PLA = 37,
    PLP = 38,

    ROL = 39,
    ROR = 40,
    RTI = 41,
    RTS = 42,

    SBC = 43,
    SEC = 44,
    SED = 45,
    SEI = 46,
    STA = 47,
    STX = 48,
    STY = 49,

    TAX = 50,
    TAY = 51,
    TSX = 52,
    TXA = 53,
    TXS = 54,
    TYA = 55,

    ALR = 56,
    ANC = 57,
    ARR = 58,
    AXS = 59,
    LAX = 60,
    SAX = 61,
    DCP = 62,
    ISC = 63,
    RLA = 64,
    RRA = 65,
    SLO = 66,
    SRE = 67,
    SKB = 68,
    IGN = 69,

    DUMMY = 70, // dummy instruction used for 'halting' the processor some cycles
}

enum ADDR {
    // Addressing modes:
    ZP = 0,
    REL = 1,
    IMP = 2,
    ABS = 3,
    ACC = 4,
    IMM = 5,
    ZPX = 6,
    ZPY = 7,
    ABSX = 8,
    ABSY = 9,
    PREIDXIND = 10,
    POSTIDXIND = 11,
    INDABS = 12,
}
export class OpData {
    // prettier-ignore
    public cycTable = [
        /*0x00*/ 7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6,
        /*0x10*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
        /*0x20*/ 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6,
        /*0x30*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
        /*0x40*/ 6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6,
        /*0x50*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
        /*0x60*/ 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6,
        /*0x70*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
        /*0x80*/ 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
        /*0x90*/ 2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5,
        /*0xA0*/ 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
        /*0xB0*/ 2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4,
        /*0xC0*/ 2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
        /*0xD0*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
        /*0xE0*/ 2, 6, 3, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
        /*0xF0*/ 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7
    ];
    public addrDesc = [
        "Zero Page           ",
        "Relative            ",
        "Implied             ",
        "Absolute            ",
        "Accumulator         ",
        "Immediate           ",
        "Zero Page,X         ",
        "Zero Page,Y         ",
        "Absolute,X          ",
        "Absolute,Y          ",
        "Preindexed Indirect ",
        "Postindexed Indirect",
        "Indirect Absolute   "
    ];
    public opdata = new Array<number>(256);
    public instname = new Array<string>(70);
    constructor() {
        // Set all to invalid instruction (to detect crashes):
        for (var i = 0; i < 256; i++) this.opdata[i] = 0xff;
        // Now fill in all valid opcodes:

        // ADC:
        this.setOp(INS.ADC, 0x69, ADDR.IMM, 2, 2);
        this.setOp(INS.ADC, 0x65, ADDR.ZP, 2, 3);
        this.setOp(INS.ADC, 0x75, ADDR.ZPX, 2, 4);
        this.setOp(INS.ADC, 0x6d, ADDR.ABS, 3, 4);
        this.setOp(INS.ADC, 0x7d, ADDR.ABSX, 3, 4);
        this.setOp(INS.ADC, 0x79, ADDR.ABSY, 3, 4);
        this.setOp(INS.ADC, 0x61, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.ADC, 0x71, ADDR.POSTIDXIND, 2, 5);

        // AND:
        this.setOp(INS.AND, 0x29, ADDR.IMM, 2, 2);
        this.setOp(INS.AND, 0x25, ADDR.ZP, 2, 3);
        this.setOp(INS.AND, 0x35, ADDR.ZPX, 2, 4);
        this.setOp(INS.AND, 0x2d, ADDR.ABS, 3, 4);
        this.setOp(INS.AND, 0x3d, ADDR.ABSX, 3, 4);
        this.setOp(INS.AND, 0x39, ADDR.ABSY, 3, 4);
        this.setOp(INS.AND, 0x21, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.AND, 0x31, ADDR.POSTIDXIND, 2, 5);

        // ASL:
        this.setOp(INS.ASL, 0x0a, ADDR.ACC, 1, 2);
        this.setOp(INS.ASL, 0x06, ADDR.ZP, 2, 5);
        this.setOp(INS.ASL, 0x16, ADDR.ZPX, 2, 6);
        this.setOp(INS.ASL, 0x0e, ADDR.ABS, 3, 6);
        this.setOp(INS.ASL, 0x1e, ADDR.ABSX, 3, 7);

        // BCC:
        this.setOp(INS.BCC, 0x90, ADDR.REL, 2, 2);

        // BCS:
        this.setOp(INS.BCS, 0xb0, ADDR.REL, 2, 2);

        // BEQ:
        this.setOp(INS.BEQ, 0xf0, ADDR.REL, 2, 2);

        // BIT:
        this.setOp(INS.BIT, 0x24, ADDR.ZP, 2, 3);
        this.setOp(INS.BIT, 0x2c, ADDR.ABS, 3, 4);

        // BMI:
        this.setOp(INS.BMI, 0x30, ADDR.REL, 2, 2);

        // BNE:
        this.setOp(INS.BNE, 0xd0, ADDR.REL, 2, 2);

        // BPL:
        this.setOp(INS.BPL, 0x10, ADDR.REL, 2, 2);

        // BRK:
        this.setOp(INS.BRK, 0x00, ADDR.IMP, 1, 7);

        // BVC:
        this.setOp(INS.BVC, 0x50, ADDR.REL, 2, 2);

        // BVS:
        this.setOp(INS.BVS, 0x70, ADDR.REL, 2, 2);

        // CLC:
        this.setOp(INS.CLC, 0x18, ADDR.IMP, 1, 2);

        // CLD:
        this.setOp(INS.CLD, 0xd8, ADDR.IMP, 1, 2);

        // CLI:
        this.setOp(INS.CLI, 0x58, ADDR.IMP, 1, 2);

        // CLV:
        this.setOp(INS.CLV, 0xb8, ADDR.IMP, 1, 2);

        // CMP:
        this.setOp(INS.CMP, 0xc9, ADDR.IMM, 2, 2);
        this.setOp(INS.CMP, 0xc5, ADDR.ZP, 2, 3);
        this.setOp(INS.CMP, 0xd5, ADDR.ZPX, 2, 4);
        this.setOp(INS.CMP, 0xcd, ADDR.ABS, 3, 4);
        this.setOp(INS.CMP, 0xdd, ADDR.ABSX, 3, 4);
        this.setOp(INS.CMP, 0xd9, ADDR.ABSY, 3, 4);
        this.setOp(INS.CMP, 0xc1, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.CMP, 0xd1, ADDR.POSTIDXIND, 2, 5);

        // CPX:
        this.setOp(INS.CPX, 0xe0, ADDR.IMM, 2, 2);
        this.setOp(INS.CPX, 0xe4, ADDR.ZP, 2, 3);
        this.setOp(INS.CPX, 0xec, ADDR.ABS, 3, 4);

        // CPY:
        this.setOp(INS.CPY, 0xc0, ADDR.IMM, 2, 2);
        this.setOp(INS.CPY, 0xc4, ADDR.ZP, 2, 3);
        this.setOp(INS.CPY, 0xcc, ADDR.ABS, 3, 4);

        // DEC:
        this.setOp(INS.DEC, 0xc6, ADDR.ZP, 2, 5);
        this.setOp(INS.DEC, 0xd6, ADDR.ZPX, 2, 6);
        this.setOp(INS.DEC, 0xce, ADDR.ABS, 3, 6);
        this.setOp(INS.DEC, 0xde, ADDR.ABSX, 3, 7);

        // DEX:
        this.setOp(INS.DEX, 0xca, ADDR.IMP, 1, 2);

        // DEY:
        this.setOp(INS.DEY, 0x88, ADDR.IMP, 1, 2);

        // EOR:
        this.setOp(INS.EOR, 0x49, ADDR.IMM, 2, 2);
        this.setOp(INS.EOR, 0x45, ADDR.ZP, 2, 3);
        this.setOp(INS.EOR, 0x55, ADDR.ZPX, 2, 4);
        this.setOp(INS.EOR, 0x4d, ADDR.ABS, 3, 4);
        this.setOp(INS.EOR, 0x5d, ADDR.ABSX, 3, 4);
        this.setOp(INS.EOR, 0x59, ADDR.ABSY, 3, 4);
        this.setOp(INS.EOR, 0x41, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.EOR, 0x51, ADDR.POSTIDXIND, 2, 5);

        // INC:
        this.setOp(INS.INC, 0xe6, ADDR.ZP, 2, 5);
        this.setOp(INS.INC, 0xf6, ADDR.ZPX, 2, 6);
        this.setOp(INS.INC, 0xee, ADDR.ABS, 3, 6);
        this.setOp(INS.INC, 0xfe, ADDR.ABSX, 3, 7);

        // INX:
        this.setOp(INS.INX, 0xe8, ADDR.IMP, 1, 2);

        // INY:
        this.setOp(INS.INY, 0xc8, ADDR.IMP, 1, 2);

        // JMP:
        this.setOp(INS.JMP, 0x4c, ADDR.ABS, 3, 3);
        this.setOp(INS.JMP, 0x6c, ADDR.INDABS, 3, 5);

        // JSR:
        this.setOp(INS.JSR, 0x20, ADDR.ABS, 3, 6);

        // LDA:
        this.setOp(INS.LDA, 0xa9, ADDR.IMM, 2, 2);
        this.setOp(INS.LDA, 0xa5, ADDR.ZP, 2, 3);
        this.setOp(INS.LDA, 0xb5, ADDR.ZPX, 2, 4);
        this.setOp(INS.LDA, 0xad, ADDR.ABS, 3, 4);
        this.setOp(INS.LDA, 0xbd, ADDR.ABSX, 3, 4);
        this.setOp(INS.LDA, 0xb9, ADDR.ABSY, 3, 4);
        this.setOp(INS.LDA, 0xa1, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.LDA, 0xb1, ADDR.POSTIDXIND, 2, 5);

        // LDX:
        this.setOp(INS.LDX, 0xa2, ADDR.IMM, 2, 2);
        this.setOp(INS.LDX, 0xa6, ADDR.ZP, 2, 3);
        this.setOp(INS.LDX, 0xb6, ADDR.ZPY, 2, 4);
        this.setOp(INS.LDX, 0xae, ADDR.ABS, 3, 4);
        this.setOp(INS.LDX, 0xbe, ADDR.ABSY, 3, 4);

        // LDY:
        this.setOp(INS.LDY, 0xa0, ADDR.IMM, 2, 2);
        this.setOp(INS.LDY, 0xa4, ADDR.ZP, 2, 3);
        this.setOp(INS.LDY, 0xb4, ADDR.ZPX, 2, 4);
        this.setOp(INS.LDY, 0xac, ADDR.ABS, 3, 4);
        this.setOp(INS.LDY, 0xbc, ADDR.ABSX, 3, 4);

        // LSR:
        this.setOp(INS.LSR, 0x4a, ADDR.ACC, 1, 2);
        this.setOp(INS.LSR, 0x46, ADDR.ZP, 2, 5);
        this.setOp(INS.LSR, 0x56, ADDR.ZPX, 2, 6);
        this.setOp(INS.LSR, 0x4e, ADDR.ABS, 3, 6);
        this.setOp(INS.LSR, 0x5e, ADDR.ABSX, 3, 7);

        // NOP:
        this.setOp(INS.NOP, 0x1a, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0x3a, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0x5a, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0x7a, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0xda, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0xea, ADDR.IMP, 1, 2);
        this.setOp(INS.NOP, 0xfa, ADDR.IMP, 1, 2);

        // ORA:
        this.setOp(INS.ORA, 0x09, ADDR.IMM, 2, 2);
        this.setOp(INS.ORA, 0x05, ADDR.ZP, 2, 3);
        this.setOp(INS.ORA, 0x15, ADDR.ZPX, 2, 4);
        this.setOp(INS.ORA, 0x0d, ADDR.ABS, 3, 4);
        this.setOp(INS.ORA, 0x1d, ADDR.ABSX, 3, 4);
        this.setOp(INS.ORA, 0x19, ADDR.ABSY, 3, 4);
        this.setOp(INS.ORA, 0x01, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.ORA, 0x11, ADDR.POSTIDXIND, 2, 5);

        // PHA:
        this.setOp(INS.PHA, 0x48, ADDR.IMP, 1, 3);

        // PHP:
        this.setOp(INS.PHP, 0x08, ADDR.IMP, 1, 3);

        // PLA:
        this.setOp(INS.PLA, 0x68, ADDR.IMP, 1, 4);

        // PLP:
        this.setOp(INS.PLP, 0x28, ADDR.IMP, 1, 4);

        // ROL:
        this.setOp(INS.ROL, 0x2a, ADDR.ACC, 1, 2);
        this.setOp(INS.ROL, 0x26, ADDR.ZP, 2, 5);
        this.setOp(INS.ROL, 0x36, ADDR.ZPX, 2, 6);
        this.setOp(INS.ROL, 0x2e, ADDR.ABS, 3, 6);
        this.setOp(INS.ROL, 0x3e, ADDR.ABSX, 3, 7);

        // ROR:
        this.setOp(INS.ROR, 0x6a, ADDR.ACC, 1, 2);
        this.setOp(INS.ROR, 0x66, ADDR.ZP, 2, 5);
        this.setOp(INS.ROR, 0x76, ADDR.ZPX, 2, 6);
        this.setOp(INS.ROR, 0x6e, ADDR.ABS, 3, 6);
        this.setOp(INS.ROR, 0x7e, ADDR.ABSX, 3, 7);

        // RTI:
        this.setOp(INS.RTI, 0x40, ADDR.IMP, 1, 6);

        // RTS:
        this.setOp(INS.RTS, 0x60, ADDR.IMP, 1, 6);

        // SBC:
        this.setOp(INS.SBC, 0xe9, ADDR.IMM, 2, 2);
        this.setOp(INS.SBC, 0xe5, ADDR.ZP, 2, 3);
        this.setOp(INS.SBC, 0xf5, ADDR.ZPX, 2, 4);
        this.setOp(INS.SBC, 0xed, ADDR.ABS, 3, 4);
        this.setOp(INS.SBC, 0xfd, ADDR.ABSX, 3, 4);
        this.setOp(INS.SBC, 0xf9, ADDR.ABSY, 3, 4);
        this.setOp(INS.SBC, 0xe1, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.SBC, 0xf1, ADDR.POSTIDXIND, 2, 5);

        // SEC:
        this.setOp(INS.SEC, 0x38, ADDR.IMP, 1, 2);

        // SED:
        this.setOp(INS.SED, 0xf8, ADDR.IMP, 1, 2);

        // SEI:
        this.setOp(INS.SEI, 0x78, ADDR.IMP, 1, 2);

        // STA:
        this.setOp(INS.STA, 0x85, ADDR.ZP, 2, 3);
        this.setOp(INS.STA, 0x95, ADDR.ZPX, 2, 4);
        this.setOp(INS.STA, 0x8d, ADDR.ABS, 3, 4);
        this.setOp(INS.STA, 0x9d, ADDR.ABSX, 3, 5);
        this.setOp(INS.STA, 0x99, ADDR.ABSY, 3, 5);
        this.setOp(INS.STA, 0x81, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.STA, 0x91, ADDR.POSTIDXIND, 2, 6);

        // STX:
        this.setOp(INS.STX, 0x86, ADDR.ZP, 2, 3);
        this.setOp(INS.STX, 0x96, ADDR.ZPY, 2, 4);
        this.setOp(INS.STX, 0x8e, ADDR.ABS, 3, 4);

        // STY:
        this.setOp(INS.STY, 0x84, ADDR.ZP, 2, 3);
        this.setOp(INS.STY, 0x94, ADDR.ZPX, 2, 4);
        this.setOp(INS.STY, 0x8c, ADDR.ABS, 3, 4);

        // TAX:
        this.setOp(INS.TAX, 0xaa, ADDR.IMP, 1, 2);

        // TAY:
        this.setOp(INS.TAY, 0xa8, ADDR.IMP, 1, 2);

        // TSX:
        this.setOp(INS.TSX, 0xba, ADDR.IMP, 1, 2);

        // TXA:
        this.setOp(INS.TXA, 0x8a, ADDR.IMP, 1, 2);

        // TXS:
        this.setOp(INS.TXS, 0x9a, ADDR.IMP, 1, 2);

        // TYA:
        this.setOp(INS.TYA, 0x98, ADDR.IMP, 1, 2);

        // ALR:
        this.setOp(INS.ALR, 0x4b, ADDR.IMM, 2, 2);

        // ANC:
        this.setOp(INS.ANC, 0x0b, ADDR.IMM, 2, 2);
        this.setOp(INS.ANC, 0x2b, ADDR.IMM, 2, 2);

        // ARR:
        this.setOp(INS.ARR, 0x6b, ADDR.IMM, 2, 2);

        // AXS:
        this.setOp(INS.AXS, 0xcb, ADDR.IMM, 2, 2);

        // LAX:
        this.setOp(INS.LAX, 0xa3, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.LAX, 0xa7, ADDR.ZP, 2, 3);
        this.setOp(INS.LAX, 0xaf, ADDR.ABS, 3, 4);
        this.setOp(INS.LAX, 0xb3, ADDR.POSTIDXIND, 2, 5);
        this.setOp(INS.LAX, 0xb7, ADDR.ZPY, 2, 4);
        this.setOp(INS.LAX, 0xbf, ADDR.ABSY, 3, 4);

        // SAX:
        this.setOp(INS.SAX, 0x83, ADDR.PREIDXIND, 2, 6);
        this.setOp(INS.SAX, 0x87, ADDR.ZP, 2, 3);
        this.setOp(INS.SAX, 0x8f, ADDR.ABS, 3, 4);
        this.setOp(INS.SAX, 0x97, ADDR.ZPY, 2, 4);

        // DCP:
        this.setOp(INS.DCP, 0xc3, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.DCP, 0xc7, ADDR.ZP, 2, 5);
        this.setOp(INS.DCP, 0xcf, ADDR.ABS, 3, 6);
        this.setOp(INS.DCP, 0xd3, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.DCP, 0xd7, ADDR.ZPX, 2, 6);
        this.setOp(INS.DCP, 0xdb, ADDR.ABSY, 3, 7);
        this.setOp(INS.DCP, 0xdf, ADDR.ABSX, 3, 7);

        // ISC:
        this.setOp(INS.ISC, 0xe3, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.ISC, 0xe7, ADDR.ZP, 2, 5);
        this.setOp(INS.ISC, 0xef, ADDR.ABS, 3, 6);
        this.setOp(INS.ISC, 0xf3, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.ISC, 0xf7, ADDR.ZPX, 2, 6);
        this.setOp(INS.ISC, 0xfb, ADDR.ABSY, 3, 7);
        this.setOp(INS.ISC, 0xff, ADDR.ABSX, 3, 7);

        // RLA:
        this.setOp(INS.RLA, 0x23, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.RLA, 0x27, ADDR.ZP, 2, 5);
        this.setOp(INS.RLA, 0x2f, ADDR.ABS, 3, 6);
        this.setOp(INS.RLA, 0x33, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.RLA, 0x37, ADDR.ZPX, 2, 6);
        this.setOp(INS.RLA, 0x3b, ADDR.ABSY, 3, 7);
        this.setOp(INS.RLA, 0x3f, ADDR.ABSX, 3, 7);

        // RRA:
        this.setOp(INS.RRA, 0x63, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.RRA, 0x67, ADDR.ZP, 2, 5);
        this.setOp(INS.RRA, 0x6f, ADDR.ABS, 3, 6);
        this.setOp(INS.RRA, 0x73, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.RRA, 0x77, ADDR.ZPX, 2, 6);
        this.setOp(INS.RRA, 0x7b, ADDR.ABSY, 3, 7);
        this.setOp(INS.RRA, 0x7f, ADDR.ABSX, 3, 7);

        // SLO:
        this.setOp(INS.SLO, 0x03, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.SLO, 0x07, ADDR.ZP, 2, 5);
        this.setOp(INS.SLO, 0x0f, ADDR.ABS, 3, 6);
        this.setOp(INS.SLO, 0x13, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.SLO, 0x17, ADDR.ZPX, 2, 6);
        this.setOp(INS.SLO, 0x1b, ADDR.ABSY, 3, 7);
        this.setOp(INS.SLO, 0x1f, ADDR.ABSX, 3, 7);

        // SRE:
        this.setOp(INS.SRE, 0x43, ADDR.PREIDXIND, 2, 8);
        this.setOp(INS.SRE, 0x47, ADDR.ZP, 2, 5);
        this.setOp(INS.SRE, 0x4f, ADDR.ABS, 3, 6);
        this.setOp(INS.SRE, 0x53, ADDR.POSTIDXIND, 2, 8);
        this.setOp(INS.SRE, 0x57, ADDR.ZPX, 2, 6);
        this.setOp(INS.SRE, 0x5b, ADDR.ABSY, 3, 7);
        this.setOp(INS.SRE, 0x5f, ADDR.ABSX, 3, 7);

        // SKB:
        this.setOp(INS.SKB, 0x80, ADDR.IMM, 2, 2);
        this.setOp(INS.SKB, 0x82, ADDR.IMM, 2, 2);
        this.setOp(INS.SKB, 0x89, ADDR.IMM, 2, 2);
        this.setOp(INS.SKB, 0xc2, ADDR.IMM, 2, 2);
        this.setOp(INS.SKB, 0xe2, ADDR.IMM, 2, 2);

        // SKB:
        this.setOp(INS.IGN, 0x0c, ADDR.ABS, 3, 4);
        this.setOp(INS.IGN, 0x1c, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0x3c, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0x5c, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0x7c, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0xdc, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0xfc, ADDR.ABSX, 3, 4);
        this.setOp(INS.IGN, 0x04, ADDR.ZP, 2, 3);
        this.setOp(INS.IGN, 0x44, ADDR.ZP, 2, 3);
        this.setOp(INS.IGN, 0x64, ADDR.ZP, 2, 3);
        this.setOp(INS.IGN, 0x14, ADDR.ZPX, 2, 4);
        this.setOp(INS.IGN, 0x34, ADDR.ZPX, 2, 4);
        this.setOp(INS.IGN, 0x54, ADDR.ZPX, 2, 4);
        this.setOp(INS.IGN, 0x74, ADDR.ZPX, 2, 4);
        this.setOp(INS.IGN, 0xd4, ADDR.ZPX, 2, 4);
        this.setOp(INS.IGN, 0xf4, ADDR.ZPX, 2, 4);

        // Instruction Names:
        this.instname[0] = "ADC";
        this.instname[1] = "AND";
        this.instname[2] = "ASL";
        this.instname[3] = "BCC";
        this.instname[4] = "BCS";
        this.instname[5] = "BEQ";
        this.instname[6] = "BIT";
        this.instname[7] = "BMI";
        this.instname[8] = "BNE";
        this.instname[9] = "BPL";
        this.instname[10] = "BRK";
        this.instname[11] = "BVC";
        this.instname[12] = "BVS";
        this.instname[13] = "CLC";
        this.instname[14] = "CLD";
        this.instname[15] = "CLI";
        this.instname[16] = "CLV";
        this.instname[17] = "CMP";
        this.instname[18] = "CPX";
        this.instname[19] = "CPY";
        this.instname[20] = "DEC";
        this.instname[21] = "DEX";
        this.instname[22] = "DEY";
        this.instname[23] = "EOR";
        this.instname[24] = "INC";
        this.instname[25] = "INX";
        this.instname[26] = "INY";
        this.instname[27] = "JMP";
        this.instname[28] = "JSR";
        this.instname[29] = "LDA";
        this.instname[30] = "LDX";
        this.instname[31] = "LDY";
        this.instname[32] = "LSR";
        this.instname[33] = "NOP";
        this.instname[34] = "ORA";
        this.instname[35] = "PHA";
        this.instname[36] = "PHP";
        this.instname[37] = "PLA";
        this.instname[38] = "PLP";
        this.instname[39] = "ROL";
        this.instname[40] = "ROR";
        this.instname[41] = "RTI";
        this.instname[42] = "RTS";
        this.instname[43] = "SBC";
        this.instname[44] = "SEC";
        this.instname[45] = "SED";
        this.instname[46] = "SEI";
        this.instname[47] = "STA";
        this.instname[48] = "STX";
        this.instname[49] = "STY";
        this.instname[50] = "TAX";
        this.instname[51] = "TAY";
        this.instname[52] = "TSX";
        this.instname[53] = "TXA";
        this.instname[54] = "TXS";
        this.instname[55] = "TYA";
        this.instname[56] = "ALR";
        this.instname[57] = "ANC";
        this.instname[58] = "ARR";
        this.instname[59] = "AXS";
        this.instname[60] = "LAX";
        this.instname[61] = "SAX";
        this.instname[62] = "DCP";
        this.instname[63] = "ISC";
        this.instname[64] = "RLA";
        this.instname[65] = "RRA";
        this.instname[66] = "SLO";
        this.instname[67] = "SRE";
        this.instname[68] = "SKB";
        this.instname[69] = "IGN";
    }
    private setOp(inst: INS, op: number, addr: ADDR, size: number, cycles: number) {
        this.opdata[op] =
            (inst & 0xff) |
            ((addr & 0xff) << 8) |
            ((size & 0xff) << 16) |
            ((cycles & 0xff) << 24);
    };
}
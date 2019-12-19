
import { C64 } from "../machine/c64";
import { Platform, WASMMachine, Base6502MachinePlatform, getToolForFilename_6502, getOpcodeMetadata_6502 } from "../common/baseplatform";
import { PLATFORMS } from "../common/emu";

const C64_PRESETS = [
  {id:'hello.dasm', name:'Hello World (ASM)'},
  {id:'sidtune.dasm', name:'SID Tune (ASM)'},
  {id:'eliza.c', name:'Eliza (C)'},
  {id:'tgidemo.c', name:'TGI Graphics Demo (C)'},
];

const C64_MEMORY_MAP = { main:[
  {name:'6510 Registers',start:0x0,  size:0x2,type:'io'},
  {name:'RAM',          start:0x2,   size:0x7ffe,type:'ram'},
  {name:'Cartridge ROM',start:0x8000,size:0x2000,type:'rom'},
  {name:'BASIC ROM',    start:0xa000,size:0x2000,type:'rom'},
  {name:'RAM',          start:0xc000,size:0x1000,type:'ram'},
  {name:'VIC-II I/O',   start:0xd000,size:0x0400,type:'io'},
  {name:'Color RAM',    start:0xd800,size:0x0400,type:'io'},
  {name:'CIA 1',        start:0xdc00,size:0x0100,type:'io'},
  {name:'CIA 2',        start:0xdd00,size:0x0100,type:'io'},
  {name:'KERNAL ROM',   start:0xe000,size:0x2000,type:'rom'},
] }

class C64Platform extends Base6502MachinePlatform<C64> implements Platform {

  newMachine()          { return new C64(); }
  getPresets()          { return C64_PRESETS; }
  getDefaultExtension() { return ".c"; };
  readAddress(a)        { return this.machine.readConst(a); }
  loadBios(bios)	      { this.machine.loadBIOS(bios); }
  getMemoryMap()        { return C64_MEMORY_MAP; }
}

class C64WASMPlatform extends Base6502MachinePlatform<WASMMachine> implements Platform {

  newMachine()          { return new WASMMachine('c64'); }

  async start() {
    // TODO: start() needs to block
    await this.machine.loadWASM();
    super.start();
  }
  getPresets()          { return C64_PRESETS; }
  getDefaultExtension() { return ".c"; };
  readAddress(a)        { return this.machine.readConst(a); }
  getMemoryMap()        { return C64_MEMORY_MAP; }
}

/*
class C64WASMPlatform extends BaseWASMPlatform implements Platform {

  prefix = 'c64';

  getPresets() { return C64_PRESETS; }
  getToolForFilename = getToolForFilename_6502;
  getOpcodeMetadata = getOpcodeMetadata_6502;
  getDefaultExtension() { return ".c"; };
}
*/

PLATFORMS['c64'] = C64Platform;
PLATFORMS['c64.wasm'] = C64WASMPlatform;

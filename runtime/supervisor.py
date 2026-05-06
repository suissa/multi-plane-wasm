from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ModuleSlot:
    name: str
    wasm_path: Path
    base_addr: int
    max_pages: int
    state: str = "running"
    restarts: int = 0


class PlaneSupervisor:
    def __init__(self, repo_root: Path, nats_url: str, tick: float = 1.0) -> None:
        self.repo_root = repo_root
        self.nats_url = nats_url
        self.tick = tick
        self.registry: dict[str, ModuleSlot] = {}
        self.state_map: dict[int, str] = {}
        self._next_base = 0x1000

    def discover_modules(self) -> None:
        modules_root = self.repo_root / "planes-modules"
        for wasm in modules_root.glob("*/*.wasm"):
            name = wasm.parent.name
            slot = ModuleSlot(name=name, wasm_path=wasm, base_addr=self._next_base, max_pages=4)
            self.registry[name] = slot
            self.state_map[slot.base_addr] = "running"
            self._next_base += 0x1000

    def _probe_module(self, slot: ModuleSlot) -> bool:
        try:
            proc = subprocess.run(
                ["wasmtime", str(slot.wasm_path), "--invoke", "heartbeat"],
                capture_output=True,
                text=True,
                check=False,
            )
            return proc.returncode == 0 and "0" not in proc.stdout.strip()
        except FileNotFoundError:
            # Sem wasmtime, tratamos como saudável para modo simulado
            return True

    def _revive(self, slot: ModuleSlot) -> None:
        slot.state = "reviving"
        self.state_map[slot.base_addr] = "reviving"
        try:
            subprocess.run(
                ["wasmtime", str(slot.wasm_path), "--invoke", "revive"],
                capture_output=True,
                text=True,
                check=False,
            )
        except FileNotFoundError:
            pass
        slot.restarts += 1
        slot.state = "running"
        self.state_map[slot.base_addr] = "running"

    def monitor(self) -> None:
        while True:
            for slot in self.registry.values():
                ok = self._probe_module(slot)
                if not ok:
                    slot.state = "down"
                    self.state_map[slot.base_addr] = "down"
                    self._revive(slot)
            print(json.dumps({
                "nats": self.nats_url,
                "slots": {
                    s.name: {
                        "addr": hex(s.base_addr),
                        "state": s.state,
                        "restarts": s.restarts,
                        "max_pages": s.max_pages,
                    } for s in self.registry.values()
                }
            }))
            time.sleep(self.tick)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--nats", default=os.getenv("NATS_URL", "nats://127.0.0.1:4222"))
    parser.add_argument("--tick", type=float, default=1.0)
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    sup = PlaneSupervisor(root, nats_url=args.nats, tick=args.tick)
    sup.discover_modules()
    if not sup.registry:
        raise SystemExit("nenhum módulo .wasm encontrado em planes-modules")
    sup.monitor()


if __name__ == "__main__":
    main()

from __future__ import annotations

from dataclasses import dataclass


class LinearAccessError(RuntimeError):
    pass


@dataclass
class _Cell:
    value: object
    alive: bool = True


class LinearAutoDestroy:
    """
    Tipo linear destrutivo:
    - write-once
    - read-once
    - ao ler, limpa a célula automaticamente
    """

    __slots__ = ("_cell", "_written")

    def __init__(self) -> None:
        self._cell: _Cell | None = None
        self._written = False

    def write(self, value: object) -> None:
        if self._written:
            raise LinearAccessError("LinearAutoDestroy aceita apenas uma escrita")
        self._cell = _Cell(value=value, alive=True)
        self._written = True

    def read(self) -> object:
        if self._cell is None or not self._cell.alive:
            raise LinearAccessError("valor inexistente ou já destruído")
        value = self._cell.value
        self._cell.value = None
        self._cell.alive = False
        return value

    @property
    def is_alive(self) -> bool:
        return bool(self._cell and self._cell.alive)

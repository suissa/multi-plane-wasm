(module
  (memory (export "memory") 1 2)
  (global $state (mut i32) (i32.const 1))

  (func (export "on_event") (param $kind i32) (param $value i32) (result i32)
    local.get $kind
    i32.const 0
    i32.eq
    if (result i32)
      local.get $value
    else
      i32.const -1
    end)

  (func (export "heartbeat") (result i32)
    global.get $state)

  (func (export "fail")
    i32.const 0
    global.set $state)

  (func (export "revive")
    i32.const 1
    global.set $state)
)

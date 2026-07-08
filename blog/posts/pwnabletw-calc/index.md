---
title: Pwnable.tw - Calc
date: 2026-02-15
category: CTF
description: An exploration of a logic bug in a calculator program that leads to an out-of-bounds stack primitive, enabling a ROP-based remote code execution.
tags:
  - pwnable.tw
  - binary-exploit 
  - ctf
---

# Pwnable.tw - Calc

## 1. Initial Analysis & Protections

We audit the `calc` challenge binary. The compiler configured several standard security mitigations:
- **Stack Canary**: Enabled. The main loop calls `__readgsdword(0x14u)` inside the `calc()` function. The system verifies this cookie value before function return to block standard stack buffer overflows.
- **NX (No-Execute)**: Enabled. Stack memory permissions restrict direct execution, preventing shellcode injection payloads from running on the stack.
- **PIE (Position Independent Executable)**: Disabled. The text section loads at a static base address (`0x08048000`), ensuring that Return-Oriented Programming (ROP) gadgets remain at fixed locations.

---

## 2. Vulnerability Discovery

Auditing the decompiled logic of `calc()` reveals a calculator parsing loop. 

![Main Loop Logic](main-logic.png)

The vulnerability resides within the expression parsing logic inside `parse_expr`:

![Parser Logic](parser-logic.png)

When parsing an expression, the program relies on an operator stack to track evaluation operations. If we supply an operator at the absolute beginning of our expression (e.g., `+300`), the program attempts evaluation before pushing any numeric variables to the stack:

![Evaluation Logic](eval-logic.png)

The program executes `eval()` with `v1[0]` (the counter) initialized to `0`. 
1. The logic reads from `v1[v1[0] - 1]`, which translates to `v1[-1]`. This out-of-bounds read accesses heap or stack structures.
2. The logic performs the calculation, writes back, and decrements the counter `v1[0]` to `-1`.
3. The parser then processes the trailing number `300`. It increments `v1[0]` back to `0` and assigns the parsed value `300` directly to `v1[0]`.

This sequence corrupts the stack counter index, setting it to `300`. Subsequent calculation entries read and write at offsets relative to `v1[300]`, providing an arbitrary read/write primitive on the stack frame.

---

## 3. Exploitation Strategy

### 3.1. Stack Address Recovery
Because ASLR shifts stack bases, we require a leak to determine the location of our payload string (`/bin/sh`). 
- The `v1` array begins at offset `ebp - 0x5A0` (1440 bytes below the Saved EBP).
- Since `v1` is an array of 4-byte integers, the distance in indices is `1440 / 4 = 360`.
- Thus, index `360` (corresponding to `v1[360]`) maps directly to the Saved EBP pointer of the caller's frame.
- Sending `+360` leaks the stack address.

### 3.2. ROP Chain Architecture
Because NX permissions block shellcode execution, we chain gadgets to invoke `execve("/bin/sh", NULL, NULL)`. The target parameters occupy the following registers:
- `eax`: `11` (syscall identifier for `execve`)
- `ebx`: pointer to `/bin/sh`
- `ecx`: `0`
- `edx`: `0`
- `int 0x80` instruction to trigger the kernel interrupt

Using `ROPgadget`, we locate the required helper gadgets:
- `pop eax; ret` at `0x0805c34b`
- `pop edx; ret` at `0x080701aa`
- `pop ecx; pop ebx; ret` at `0x080701d1`
- `int 0x80` at `0x08049a21`

### 3.3. Overcoming `atoi` Restrictions: The "Ascending Write" Method

A restriction complicates data injection:
- The parser filters inputs using `atoi`.
- `atoi` interprets large unsigned integers (like stack address pointers starting with `0xffff...`) or negative numbers as invalid expression inputs, preventing direct injection.

We circumvent this validation by leveraging the side-effects of the evaluation step: `v1[offset-1] += v1[offset]`. Rather than writing values directly, we modify existing stack memory using addition:

1. We target helper index `K+1` immediately following our target variable index `K`.
2. We calculate the difference: `DIFF = TARGET - v1[K]`.
3. We send `+(K+1)+DIFF`.
4. The parser writes `DIFF` to `v1[K+1]`.
5. The evaluation runs `v1[K] += v1[K+1]`, updating `v1[K]` to our exact `TARGET` value.

Because this evaluation relies on the current value of the stack slot, we write from **lowest memory index (361) to highest memory index (372)**. Each step updates the current index and leaves a diff value in the next index, which we overwrite in the subsequent step.

---

## 4. Final Stack Frame Layout

We lay out the ROP chain sequentially starting at index `361` (the return address location):

| Index | Content | Purpose |
| :--- | :--- | :--- |
| `v1[360]` | `Saved EBP` | Leaked Stack Pointer |
| `v1[361]` | `pop eax; ret` | Gadget 1 (Set syscall index) |
| `v1[362]` | `11` | `execve` Syscall ID |
| `v1[363]` | `pop edx; ret` | Gadget 2 (Set envp pointer) |
| `v1[364]` | `0` | `envp = NULL` |
| `v1[365]` | `pop ecx; pop ebx; ret` | Gadget 3 (Set argv & path) |
| `v1[366]` | `Stack Addr (argv)` | `ecx` -> `argv` array |
| `v1[367]` | `Stack Addr (str)` | `ebx` -> `/bin/sh` string |
| `v1[368]` | `int 0x80` | Syscall Interrupt Trigger |
| `v1[369]` | `/bin` | String payload segment 1 |
| `v1[370]` | `/sh\0` | String payload segment 2 |
| `v1[371]` | `Stack Addr (str)` | `argv[0]` element |
| `v1[372]` | `0` | `argv[1] = NULL` |

---

## 5. Execution and Verification

The exploit script runs in three stages:
1. **Leak Stage**: Sends `+360` to parse the stack pointer and calculate absolute address offsets.
2. **Write Stage**: Uses the ascending write sequence to inject the ROP chain and the `/bin/sh` string.
3. **Execution Stage**: Sends an empty carriage return, causing the evaluation loop to terminate and return execution directly into the ROP chain.

The chain redirects execution, spawning a shell on the target system:

![Flag Capture](./got-flag.png)

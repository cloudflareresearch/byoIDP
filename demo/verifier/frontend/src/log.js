// Copyright 2026 Cloudflare, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Readable logging for the identity-wallet proof-of-possession flow.
//
// Every line is prefixed with [BYOID:<scope>] so the whole cross-component
// conversation (verifier page <-> extension <-> verifier backend) can be
// followed in one console. Event logs name the direction and the message type;
// large blobs (PK Token, signed message) are abbreviated to a length so the
// console stays legible.

const STYLE = 'color:#7c4dff;font-weight:bold'

// abbrev shortens long strings (e.g. a PK Token) to a prefix + length.
export function abbrev(v, n = 14) {
  if (typeof v !== 'string') return v
  return v.length <= n * 2 ? v : `${v.slice(0, n)}…(${v.length} chars)`
}

export function log(scope, msg, fields) {
  if (fields !== undefined) console.log(`%c[BYOID:${scope}]`, STYLE, msg, fields)
  else console.log(`%c[BYOID:${scope}]`, STYLE, msg)
}

// logSend / logRecv describe a message crossing a boundary (postMessage, etc.).
export function logSend(scope, to, type, fields) {
  log(scope, `→ send [${type}] to ${to}`, fields)
}
export function logRecv(scope, from, type, fields) {
  log(scope, `← recv [${type}] from ${from}`, fields)
}

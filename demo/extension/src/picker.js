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

// Shared provider picker.
//
// An "Add identity" trigger button that opens a dropdown menu of OpenID
// Providers. Used by BOTH the popup and the login consent page so choosing an
// OP is the same experience everywhere: click Add -> pick a provider. The user
// always chooses the OP explicitly; we never guess a default.

import { providerList } from './config.js'

// mountProviderPicker wires a trigger button to a dropdown menu element.
//   trigger:  the button that opens/closes the menu
//   menu:     the (initially hidden) container that will hold the options
//   onChoose: (providerId) => void, called when a provider is picked
export function mountProviderPicker(trigger, menu, onChoose) {
  menu.innerHTML = ''
  menu.hidden = true
  menu.classList.add('op-menu')
  trigger.setAttribute('aria-haspopup', 'true')
  trigger.setAttribute('aria-expanded', 'false')

  for (const p of providerList) {
    const item = document.createElement('button')
    item.type = 'button'
    item.className = 'op-option'

    const badge = document.createElement('span')
    badge.className = `op-badge op-badge-${p.id}`
    badge.setAttribute('aria-hidden', 'true')
    badge.textContent = p.label.charAt(0)

    const label = document.createElement('span')
    label.textContent = `Continue with ${p.label}`

    item.append(badge, label)
    item.addEventListener('click', () => {
      close()
      onChoose(p.id)
    })
    menu.append(item)
  }

  function open() {
    menu.hidden = false
    trigger.setAttribute('aria-expanded', 'true')
  }
  function close() {
    menu.hidden = true
    trigger.setAttribute('aria-expanded', 'false')
  }
  function toggle() {
    if (menu.hidden) open()
    else close()
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    toggle()
  })
  // Close on outside click or Escape.
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== trigger) close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  return { open, close, toggle }
}

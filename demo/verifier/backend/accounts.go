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

package main

// localAccounts holds demo users that have a username/password account with
// the Verifier itself. This is the case where the Verifier can authenticate
// the user on its own, without involving any external identity provider.
//
// In a real system this would be a database of salted password hashes; for the
// demo it is a hard-coded map. Keys are lower-cased email addresses.
var localAccounts = map[string]string{
	"alice@xyz.com": "password123",
}

// localPassword returns the stored password for a local account and whether an
// account exists for the given (already normalized) email.
func localPassword(email string) (string, bool) {
	pw, ok := localAccounts[email]
	return pw, ok
}

// googleBoundDomains are email domains for which the Verifier already has an
// OIDC client binding with Google, so users at these domains can sign in with
// "Continue with Google". In the demo we treat consumer Google Mail domains as
// bound; a real deployment would list the Workspace domains it has onboarded.
var googleBoundDomains = map[string]bool{
	"gmail.com":      true,
	"googlemail.com": true,
}

// isGoogleBoundDomain reports whether the domain can sign in via Google.
func isGoogleBoundDomain(domain string) bool {
	return googleBoundDomains[domain]
}

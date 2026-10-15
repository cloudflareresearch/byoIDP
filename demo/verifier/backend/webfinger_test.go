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

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestFetchIssuer covers the WebFinger issuer-discovery parsing against a local
// server standing in for a namespace domain. No real domain serves WebFinger,
// so this is how we exercise the positive "trust established" path.
func TestFetchIssuer(t *testing.T) {
	tests := []struct {
		name       string
		status     int
		body       string
		wantIssuer string
		wantOK     bool
	}{
		{
			name:       "declares issuer",
			status:     http.StatusOK,
			body:       `{"subject":"acct:alice@abc.com","links":[{"rel":"http://openid.net/specs/connect/1.0/issuer","href":"https://qwe.com"}]}`,
			wantIssuer: "https://qwe.com",
			wantOK:     true,
		},
		{
			name:   "no issuer link",
			status: http.StatusOK,
			body:   `{"subject":"acct:alice@abc.com","links":[{"rel":"http://webfinger.net/rel/avatar","href":"https://abc.com/a.png"}]}`,
			wantOK: false,
		},
		{
			name:   "not found",
			status: http.StatusNotFound,
			body:   "nope",
			wantOK: false,
		},
		{
			name:   "malformed json",
			status: http.StatusOK,
			body:   "<html>not jrd</html>",
			wantOK: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tt.status)
				_, _ = w.Write([]byte(tt.body))
			}))
			defer srv.Close()

			issuer, ok := fetchIssuer(context.Background(), srv.Client(), srv.URL)
			if ok != tt.wantOK {
				t.Fatalf("ok = %v, want %v", ok, tt.wantOK)
			}
			if issuer != tt.wantIssuer {
				t.Fatalf("issuer = %q, want %q", issuer, tt.wantIssuer)
			}
		})
	}
}

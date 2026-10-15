# Copyright 2026 Cloudflare, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Serves the abc.localhost demo namespace: a landing page and the
# /.well-known/byoid-configuration discovery document.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
# The well-known document is stored under well-known/ in the repo (dotfiles are
# awkward to track); place it at the dot-path nginx serves.
COPY well-known/byoid-configuration /usr/share/nginx/html/.well-known/byoid-configuration
EXPOSE 80

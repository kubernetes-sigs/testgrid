#!/usr/bin/env bash
# Copyright 2023 The TestGrid Authors.
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

set -o errexit
set -o nounset
set -o pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
PROTO_DEST="${REPO_ROOT}/web/src/gen"

cd "${REPO_ROOT}/web"

# See https://github.com/timostamm/protobuf-ts/blob/master/MANUAL.md
npx protoc --ts_out ${PROTO_DEST} --proto_path ${REPO_ROOT}/testgrid --ts_opt long_type_string \
  ${REPO_ROOT}/testgrid/pb/custom_evaluator/custom_evaluator.proto \
  ${REPO_ROOT}/testgrid/pb/state/state.proto \
  ${REPO_ROOT}/testgrid/pb/summary/summary.proto \
  ${REPO_ROOT}/testgrid/pb/config/config.proto \
  ${REPO_ROOT}/testgrid/pb/test_status/test_status.proto \
  ${REPO_ROOT}/testgrid/pb/api/v1/data.proto

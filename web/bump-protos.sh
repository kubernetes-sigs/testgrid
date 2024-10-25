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

if [ "$#" -lt 1 ]
then
  echo "Usage: $0 [path to local GCP/testgrid repo]"
  exit 1
fi

# The location of your local https://github.com/GoogleCloudPlatform/testgrid repo, where the proto files live.
TESTGRID_REPO=$1

WORKDIR="$(git rev-parse --show-toplevel)" # The root directory of your repository
PROTO_DEST="${WORKDIR}/web/src/gen"

echo "Generating protos from source $TESTGRID_REPO to destination $PROTO_DEST..."

cd "${WORKDIR}/web"

# See https://github.com/timostamm/protobuf-ts/blob/master/MANUAL.md
npx protoc --ts_out ${PROTO_DEST} --proto_path ${TESTGRID_REPO} --ts_opt long_type_string \
  ${TESTGRID_REPO}/pb/custom_evaluator/custom_evaluator.proto \
  ${TESTGRID_REPO}/pb/state/state.proto \
  ${TESTGRID_REPO}/pb/summary/summary.proto \
  ${TESTGRID_REPO}/pb/config/config.proto \
  ${TESTGRID_REPO}/pb/test_status/test_status.proto \
  ${TESTGRID_REPO}/pb/api/v1/data.proto

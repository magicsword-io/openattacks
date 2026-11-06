# Security Detections MCP Setup Guide

This document records the working setup for security-detections-mcp used to query Sigma, Splunk, Elastic, and KQL detection rules.

## Prerequisites
- Node.js installed
- Git
- ~5 GB disk space for rule repositories

## Setup Steps

### 1. Clone security-detections-mcp
```bash
cd ~
git clone https://github.com/mhaggis/security-detections-mcp.git
cd security-detections-mcp
npm install
```

### 2. Clone Detection Rule Repositories
```bash
cd ~
# Sigma rules (3,305 rules)
git clone --depth 1 https://github.com/SigmaHQ/sigma.git

# Splunk Security Content (2,204 rules)  
git clone --depth 1 https://github.com/splunk/security_content.git

# Elastic Detection Rules (2,208 rules)
git clone --depth 1 https://github.com/elastic/detection-rules.git

# Azure Sentinel / KQL rules
git clone --depth 1 https://github.com/Azure/Azure-Sentinel.git
```

### 3. Configure Environment Variables
Create `.env` file in `~/security-detections-mcp/`:
```bash
cat > ~/security-detections-mcp/.env << 'EOF'
SIGMA_PATHS=/home/ubuntu/sigma/rules,/home/ubuntu/sigma/rules-threat-hunting
SPLUNK_PATHS=/home/ubuntu/security_content/detections
ELASTIC_PATHS=/home/ubuntu/detection-rules/rules
KQL_PATHS=/home/ubuntu/Azure-Sentinel/Detections
STORY_PATHS=/home/ubuntu/security_content/stories
EOF
```

### 4. Build MCP Server
```bash
cd ~/security-detections-mcp
source .env
npm run build
```

This indexes **7,717 detections** (3,305 Sigma + 2,204 Splunk + 2,208 Elastic).

### 5. Test Query
```bash
cd ~/security-detections-mcp
cat > search.sh << 'EOF'
#!/bin/bash
source .env
query="$1"
limit="${2:-5}"
echo "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"search\",\"arguments\":{\"query\":\"$query\",\"limit\":$limit}}}" | \
  timeout 5 node dist/index.js 2>/dev/null | \
  python3 -c "import sys, json; r=json.load(sys.stdin); print(json.dumps(json.loads(r['result']['content'][0]['text']), indent=2))"
EOF
chmod +x search.sh
./search.sh "nmap reconnaissance" 3
```

Expected output: JSON with detection rules from Sigma/Splunk/Elastic.

## Available Tools
- `search` - Full-text search across all detections
- `get_by_id` - Get detection by ID
- `list_by_mitre` - Filter by MITRE technique
- `list_by_source` - Filter by source (sigma/splunk/elastic/kql)
- `analyze_coverage` - Analyze detection coverage

## Usage in OpenAttacks
Query for behaviors, retrieve and verify the complete upstream rule, then add a canonical profile at `detections/<profile>.yaml`. Keep upstream and adapted rules distinguishable and include the real repository URL, revision, author/license, log requirements and stage relationship. The website displays the stored Sigma, KQL and SPL query text directly; it does not publish an MCP prompt.

The profile shape is:
```yaml
id: example-profile
title: Example behavior
hypothesis: What defenders should test
visibility: Required visibility
telemetry: []
investigate: []
limitation: What the query cannot establish
search: []
reviewed: YYYY-MM-DD
origin: catalog_authored
query_kind: native # native | custom_schema | gap
query_scope: Exact collector and field-mapping scope
queries:
  sigma: |
    # Experimental Sigma YAML
  kql: |
    # Draft KQL
  spl: |
    # Draft SPL
```

## Troubleshooting
- If indexing fails, verify all repos cloned successfully
- If queries timeout, increase timeout in search script
- KQL rules may require additional Azure-specific setup

## Performance
- Initial index: ~10-15 seconds
- Query response: <500ms typical
- Total disk usage: ~4.5 GB

#!/bin/bash

# Install Git hooks for the P-Frog project

HOOKS_DIR=".git/hooks"
TOOLS_HOOKS_DIR="tools/git-hooks"

echo "Installing Git hooks..."

# Copy commit-msg hook
if [ -f "$TOOLS_HOOKS_DIR/commit-msg" ]; then
    cp "$TOOLS_HOOKS_DIR/commit-msg" "$HOOKS_DIR/commit-msg"
    chmod +x "$HOOKS_DIR/commit-msg"
    echo "✅ Installed commit-msg hook (commit message validation)"
else
    echo "❌ Could not find $TOOLS_HOOKS_DIR/commit-msg"
    exit 1
fi

echo ""
echo "Git hooks installed successfully!"
echo "Commit message format: PF-{number} {message}"

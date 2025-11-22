#!/bin/bash

# Install Git hooks for the P-Frog project

HOOKS_DIR=".git/hooks"
TOOLS_HOOKS_DIR="tools/git-hooks"

echo "Installing Git hooks..."

# Copy pre-push hook
if [ -f "$TOOLS_HOOKS_DIR/pre-push" ]; then
    cp "$TOOLS_HOOKS_DIR/pre-push" "$HOOKS_DIR/pre-push"
    chmod +x "$HOOKS_DIR/pre-push"
    echo "✅ Installed pre-push hook (branch name validation)"
else
    echo "❌ Could not find $TOOLS_HOOKS_DIR/pre-push"
    exit 1
fi

echo ""
echo "Git hooks installed successfully!"
echo "Branch naming pattern enforced: PF-{number}_{LettersOnly}"

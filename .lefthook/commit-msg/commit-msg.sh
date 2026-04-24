function check_commit_message() {
  local message="$1"
  local regex="^(feat|fix|bugs?|hot|docs?|style|test|refactor|perf|ci|chore|build)(\([a-zA-Z0-9-]*\))?:"

  echo "  ✔ Commit message: $message"

  if [[ $message =~ $regex ]]; then
    echo -e ' \e[32m ✔ Commit message format looks good.\e[0m'
  else
    echo '  ✘ FORMAT: Commit message format should follow https://www.conventionalcommits.org/en/v1.0.0/'
    echo '  ✘ EXAMPLE: "fix(button): Improved button click behavior"'
    echo '  ✘ ERROR DETAILS: The type (feat, fix, etc.) should be followed by an optional scope in parentheses (e.g., (button)).'
    errors=$((errors + 1))
  fi
}

if [[ ! -f "$1" || ! -s "$1" ]]; then
  echo '✘ ERROR: Commit message file does not exist or is empty.'
  exit 1
fi

commit_message="$(cat "$1")"
check_commit_message "$commit_message"

if [[ $errors -gt 0 ]]; then
  echo -e "\e[31m✘ There are $errors error(s) to fix before committing. Please review your commit message format.\e[0m"
  exit 1
else
  echo -e "\e[32m✔ Good to go!\e[0m"
fi

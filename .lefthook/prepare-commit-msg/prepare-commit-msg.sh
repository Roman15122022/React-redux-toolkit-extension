branchName=$(git symbolic-ref --short HEAD | cut -d "/" -f2)

if [[ "${branchName}" =~ [a-zA-Z]+ && "${branchName}" =~ [0-9]+ && "${branchName}" =~ - ]]; then
  echo "${branchName}" >> "$1"
fi

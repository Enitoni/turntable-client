git stash --include-untracked

let update_output = git submodule update --remote --merge
if ($update_output | is-not-empty) {
	print $update_output
	git add .
	git commit -m "update submodules"
}

git stash pop

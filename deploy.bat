@echo off

git checkout master
git pull origin master

rem First result is the current branch, but for some reason it's not
rem shown in %%b. Important to be on the master branch when doing this loop.
set branchFound=false
for /f %%b in ('git branch') do (
    if %%b==gh-pages (
        set branchFound=true
    )
)

if %branchFound%==true (
    echo Rebasing gh-pages branch to master
    git checkout gh-pages
    git rebase master

    echo Building data artifact
    cd analysis/dataTools
    node build
    cd ../..

    echo Delivering artifacts
    rem Commit any changes made to normally untracked artifacts
    git add *
    git commit -m "Deployed new version"
    git push origin gh-pages --force

    echo Cleaning up
    git checkout master
    cd analysis/dataTools
    node build
    cd ../..

    echo Deployment done!

) else (
    echo There is no 'gh-pages' branch! Please create it.
    echo Can not create it automatically for the following reasons:
    echo The 'gh-pages' branch should remove build artifacts from .gitignore
)

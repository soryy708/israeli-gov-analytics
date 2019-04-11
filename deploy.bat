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
    git checkout gh-pages
    git rebase master

    cd analysis/dataTools
    node build
    cd ../..

    git add *
    git commit -m "Deployed new version"
    git push origin gh-pages
    git checkout master

    echo Deployment done!

) else (
    echo There is no 'gh-pages' branch! Please create it.
    echo Can not create it automatically for the following reasons:
    echo The 'gh-pages' branch should remove build artifacts from .gitignore
)

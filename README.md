# gt-wiki
Helper for Guardian Tales wiki data and assets management

# TODO
* write small shell scripts for automating stuff
* fetch assets from `patch-w` domain
* try auto-pushing edits to wiki using [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)
* create organized directories for versions
* create a custom `strings-enUS.json`

# Cloning
Version assets are stored in the form of [Git LFS](https://git-lfs.com/) in order to avoid bloated repository. When cloning, you can choose to either download all LFS assets (recommended):
```bash
$ git clone https://github.com/SuggonM/gt-wiki
```
…or opt out from it:
```bash
$ git clone --config lfs.fetchexclude="*" https://github.com/SuggonM/gt-wiki
```

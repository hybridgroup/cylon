## Cylon Website

This site is build using [Middleman](http://middlemanapp.com/getting-started/)  
  
To run locally:  

      bundle install
      bundle exec middleman

### Deploy

[middleman-gh-pages](https://github.com/neo/middleman-gh-pages) gem is being used to build the webpage and deploy to gh-pages branch.  

For deploying the webpage, your must be in 'Cylon.js.io' branch and run the following command:

      rake publish

### Documentation

This project uses HAML.

If you want to help us with the documentation of the site, you can follow this steps :

- 1) Download the zip of the branch "cylonjs.com" or clone the project with git.

		  git clone https://github.com/hybridgroup/cylon.git "name"

- 2) Create a new branch for the project and switch to that new branch.

		  git branch "new_name"
		  git checkout "new_name"

- 3) Open the project with your favourite text editor.

- 4) Go to the file `source/documentation` , here is all the documentation of the site.

#### Platforms

To add new information to any platform, do this : 

- 1) Go to the file `source/documentation/platforms` , and select the platform you want to edit.

#### Drivers

To add new information to any driver, do this : 

- 1) Go to the file `source/documentation/drivers` , and select the driver you want to edit.

#### Examples

To create a new example for any driver or platform, do this : 

- 1) Go to the file `source/documentation/examples` , and create a new file `file.html.haml`.

- 2) Add the path into this file `source/documentation/index.html.haml`, on the examples section.

- 3) Add this code to the top part of your file :
		
		  ---
		  title: Site Title
		  author: Author
		  page_title: Page Title
		  page_subtitle: "Page Subtitle"
		  layout: page
		  ---

### Sed your Pull Request

When you have your code ready, create a new PR : `base: cylonjs.com` and `compare:"your_branch"`

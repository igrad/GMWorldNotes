# GM World Notes
A tool for GMs to efficiently keep note of their world, including its locations, denizens, items, and more.

#### Technical:
The user can choose between any number of notebooks to use, which they may create, edit, or delete. Within each notebook is a series of categorized pages that can be used to define a blueprint of the GM's world in its entirety. Each notebook is structured as a tree, with each node having a single parent and one or more children.

Each time the application is launched, a file is created, called session.json. This file contains the following information about the last time it was used:
- Last run time
- Last run version
- Last notebook that was open
- Last page that was open

Each notebook created by the user contains the structure of the notebook. Each page's links and high-level information is included here. Notebook ids are stored as a simple 4-digit decimal integer
- Name of the notebook
- The time that the notebook was created
- The number of nodes included within this notebook
- The root node itself, which is created so that each 2nd level node can have the root as their parent
- JSON data containing the structure of the notebook's nodes

There are two types of nodes contained within a notebook's structure: containers and pages. Both are also referred to as nodes since they are both represented similarly in the notebook's structure. Each page has its own HTML file (with CSS injected at the top), which is what gets loaded to the application when the page is requested to load. There are a few attributes to each node, which are listed here.
- Identifier - this is the name of the HTML file that is used when referencing this page
- Name of the page itself, which is how it is referred to by the user
    - The name is not used as the identifier because we want to allow multiple pages with the same name within a container
- All data of nodes within the node tree

#### Dependencies:
- [IcoMoon-Free by Keyamoon](https://icomoon.io/#icons "IcoMoon-Free by Keyamoon")

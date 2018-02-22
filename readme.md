World Notes

Description:
A tool for GMs to efficiently keep note of their world, including its locations, denizens, items, and more. This allows for notes, images, pins, and lots of styling.



Technical:
The GMs notes themselves are built as a linked list. Each node has three 4 attributes:

- Index: A hex value using powers of 256 to represent the depth and parents of the node
   - The root node is index "0x"
   - Each child node is given a 2-digit suffix to the parent's index
   - E.g. If a parent is "0x01", the first child would be "0x0100", and the 5th child would be "0x0104", all the way up to "0x01ff", which would be the 256th child of that parent.
- Type: Location, Item, Person, or Group
   - Person: A player character, NPC, villain, etc
   - Group: An amalgamation of Person nodes
   - Location: A point of interest or an entire city within the world
   - Item: An article or object of importance
- Style: Each node type has a default style, but this can be customized
- Associations: Other nodes that link to this node (this is just a list of node indices)


Node operations:
- Show location (format: "World -> Continent -> Region -> City -> Faction -> Person")
- Move location
- Delete page

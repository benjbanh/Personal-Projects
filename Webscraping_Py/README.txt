Notes for Darryl:
    The tree.txt file is the generated skill tree in a readable text file and shows the structure of the skills

    The file you can use is called Main_nosave since I modified it so it doesn't save the HTML file to your computer
    The main function to be replaced is called find_cheapest_tree(), with the driver code being at the bottom




TBD:
need to several catagories:
-> personality, clan, religion
-> only 1 personality, religion, clan etc.
    boolean to only have 1
have score == -1 to only have 1 of
    need to use path2 

need to reevaluate ancestors of removed path
-> Remove 2 leaf nodes to add a node of len(2) path
    -> Ex: Removed '['Elk Skiier', 'Bear-Soul']'-- and hunter could be worse alternative

need to change so sort occurs after cat_ encountered, or node.score == 0

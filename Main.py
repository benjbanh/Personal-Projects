from bs4 import BeautifulSoup
import requests
import os
import os.path
import math
from collections import defaultdict 

"""
    Need to find all subtrees of k size that contain the root node
        k=(7+level)
    then evaluate every tree and return the tree with the smallest value
"""

# URL of the webpage to scrape
url = "https://www.ifelsemedia.com/swordandglory/perklist/"
file_path = r"C:\Users\benjb\Downloads\Webscrape.txt"
class_list = [
    "cat_Occupation",   
    "cat_CombatSkill",
    "cat_Religion",
    "cat_Adventure",
    "cat_Clan",
    "cat_Personality",
]

trait_dict = {
    # Defence traits
    "health": [],
    "defense": [],
    "defense recovery"  : [],

    # Attacking traits 
    "dominance": [],
    "damage": [],
    "speed": [],
    "stamina": [],
    "stamina recovery": [],

    # Other
    "wealth": [],
    "glory": [],
    }

priority_list = ["dominance","damage","stamina","defense","stamina recovery","defense recovery","wealth","speed","health","glory",]

class TreeNode:
    def __init__(self, name, req, trait, score=0):
        self.ancestor = None
        self.children = []
        self.name = name
        self.req = req
        self.trait = trait
        self.score = score
        self.num = 0

    def copy_childless(self):
        return TreeNode(self.name, self.req, self.trait, self.score)
    
    def add_child(self,new_child):
        self.children.append(new_child)

    # Given the name of the child, finds and removes the child from the list
    def remove_child(self,child_name):
        for c in self.children:
            if c.name == child_name:
                self.children.remove(c)
                print("Removed", c.name, "from", self.name)
                return
        

###############################################################################################
#                                   TREE FUNCTIONS
###############################################################################################
def find_name(root, target_name):
    if root is None:
        return None
    if target_name == root.name:
        return root
    # Recursively search in the children of the current node
    for child in root.children:
        result = find_name(child, target_name)
        if result:
            return result
    return None

# Assumes all required nodes are contained in the list
# Will recursively go forever if exception
def add_node(root, new_node, list=None):  
    # Adds class_name to root node 
    if new_node.req is None:
        root.children.append(new_node)
        new_node.ancestor = root
        # print(f"    {root.name} -> {new_node.name}")
        return True
    
    # For level 1 skills
    elif len(new_node.req) <= 1:
        root.children.append(new_node)
        new_node.ancestor = root
        # print(f"    {root.name} -> {new_node.name}")
        return True

    parent_node = find_name(root, new_node.req[1])

    if parent_node:
        # print(f"    {parent_node.name} -> {new_node.name}")
        parent_node.children.append(new_node)
        new_node.ancestor = parent_node
        return True
    else:
        # print(f" x  \"{new_node.req[1]}\" not found.")
        if list:
            list.append(node)  
        else:
            print(f" x  \"{new_node.req[1]}\" not found.")

def remove_node(root, node_num):
    if root is None:
        return None
    if node_num == root.num:
        root.ancestor.remove_child(root)
        return root
    # Recursively search in the children of the current node
    for child in root.children:
        result = remove_node(child, node_num)
        if result:
            return result
    return None


# get size from trait list
def count_nodes(root):
    if root is None:
        return 0
    
    # Initialize the count with 1 for the current node
    count = 1
    
    # Recursively count nodes in each child
    for child in root.children:
        count += count_nodes(child)
    
    return count

def assign_num(root):
    if root is None:
        return 0

    queue = []
    queue.append(root)
    count = 0 

    while queue:
        level_size = len(queue)
    
        for _ in range(level_size):
            node = queue.pop(0)
            node.num = count
            count += 1
            # print(count," ",node.name)

            for child in node.children:
                queue.append(child)

    return count


# gives score to all nodes with the higher score indicating better placement(change to lower)
def score_nodes(trait_dict):
    priority_weight = 1
    rank_weight = 1
    # level_weight = 0.1
    max_score = 105
    modifier = 5

    for trait in trait_dict:
        lst = trait_dict.get(trait)
        priority_val = modifier * (len(priority_list) - priority_list.index(trait))/len(priority_list)
        rank_max = int(lst[-1].trait.split(' ')[0].strip(' +%'))
        
        if len(lst) == 0: 
            continue
        
        # level ups at: 1,4,8,13
        for skill in lst:
            level_val = skill.req[0].strip("Level ")
            if level_val == "Specia":
                skill.score = 1000
                continue
            # else:
                # level_val = 5/4*modifier - (modifier/4) * (int(level_val)//4 + 1)

            
            rank_val = modifier * int(skill.trait.split(' ')[0].strip(' +%')) / rank_max
            
            score_val = '%.2f'%((priority_weight * priority_val) + (rank_weight * rank_val))
            # score_val = '%.2f'%((priority_weight * priority_val) + (rank_weight * rank_val) + (level_weight * level_val))
            
            # # conditionals(modifications to score)
            # t = skill.trait.lower()
            # if " to " in t:
            #     # EX: +6% speed to Fast attack
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " vs " in t:
            #     # EX: +40% Glory VS opponents of lower level
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " when " in t:
            #     # EX: +6 Stamina when winning
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " for " in t:
            #     # EX: +4 Dominance for first 15 seconds
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " while " in t:
            #     # EX: +4 Defense while blocking
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " random " in t:
            #     # EX: +4 Damage at random intervals
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # else:
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            
            skill.score = max_score - int(round(float(score_val) * 10,0))
                
            
            # print(f"{skill.name}[{skill.score}] : ({priority_weight} * {priority_val}) + ({rank_weight} * {rank_val}) = {score_val}")
            
            # w/ level_val
            # print(f"{skill.name}[{100-skill.score}] = ({priority_weight} * {priority_val}) + ({rank_weight} * {rank_val}) + ({level_weight} * {level_val})")
        # print()

def primary_sort(list):
    for node in list:
        if len(node.req) == 1:
            list.remove(node)
            list.insert(0,node)  


###############################################################################################
#                                   TRAIT LIST FUNCTIONS
###############################################################################################
def add_trait(node):
    if "health" in node.trait.lower():
        trait_dict["health"].append(node)
    elif "dominance" in node.trait.lower():
        trait_dict["dominance"].append(node)
    elif "damage" in node.trait.lower():
        trait_dict["damage"].append(node)
    elif "defense recovery" in node.trait.lower():
        trait_dict["defense recovery"].append(node)
    elif "stamina recovery" in node.trait.lower():
        trait_dict["stamina recovery"].append(node)
    elif "stamina" in node.trait.lower():
        trait_dict["stamina"].append(node)
    elif "money" in node.trait.lower():
        trait_dict["wealth"].append(node)
    elif "glory" in node.trait.lower():
        trait_dict["glory"].append(node)
    elif "speed" in node.trait.lower():
        trait_dict["speed"].append(node)
    elif "defense" in node.trait.lower():
        trait_dict["defense"].append(node)
    else:
        # print(f"Failed {node.name}")
        node.score = -1
        return


###############################################################################################
#                                   PRINTING FUNCTIONS
###############################################################################################
def print_nary_tree(node, depth=0, showScore=False):
    if node:
        # Print the current node's value at the current depth
        print("    ",end="")
        if showScore:
            print("    " * depth + "#" + str(node.num) + " " + str(node.name) + " (" + str(node.score) + ")")
        else: 
            print("    " * depth + str(node.name))


        
        # Recursively print the children of the current node
        for child in node.children:
            print_nary_tree(child, depth + 1, showScore)

def print_list(list, showScores = False):
    print("List: [",end="")
    if showScores:
        for node in list:
            print(node.name,"(",node.score,")",end=", ")
    else: 
        for node in list:
            print(node.name,end=", ")
    print("]")

def print_dict(dictionary):
    print(f"List: [",end="")
    for _, value in dictionary.items():
        print(f"{value.name}",end=", ")
    print(f"] Length: {len(dictionary)}")

###############################################################################################
#                                   NEW FUNCTIONS
###############################################################################################
# returns path required to get to a node
def find_path(root, target_name, list):
    if root is None:    
        return None
    list.append(root)

    if target_name == root.name:
        return True

    for child in root.children:
        child_path = find_path(child, target_name, list)
        if child_path:
            return True

    # If the target is not found in any child, return an empty list
    list.pop(-1)
    return None

"""
Builds a copy of root with only k total nodes with the minimal total value 
Returns: path and value

Using prefix sums to efficiently store values of all nodes and nodes leading up to it
Compares every leaf node to the node being added
    make it a boolean attribute for treenode and have val = true for optimal path to make more efficient 

Things to fix: 
    sometimes error that rarely appears w/ "Proud in the Old Ways"
    need to only have 1 personality and religion
        ~exception for clan: "freed slave"

      *https://www.geeksforgeeks.org/travelling-salesman-problem-using-dynamic-programming/
"""
def find_cheapest_tree(root, k, s):
    tree_list = {}
    dp = [0 for _ in range(s)]
    leaf_nodes = {}
    exclusive_list = {
        'cat_Personality': None,
        'cat_Religion': None,
        'cat_Clan': None,
    }

    def dfs(node, depth=0):
        if node is None:
            return 1000    
        if depth >= k:
            return 1000
        
        # add to dp list
        if node.ancestor:
            dp[node.num] = dp[node.ancestor.num] + node.score
        else:
            dp[node.num] = node.score

        print("    " * depth + "#" + str(node.num) + " " + str(node.name) + "{" + str(dp[node.num]) + "}")
        
        # Adding to optimal tree
        nonlocal tree_list
        nonlocal leaf_nodes
        if len(tree_list) >= k:
            #finds first common node between the ancestor of the node and nodes existing in the tree_list
            for n in leaf_nodes.copy():         #Error: dictionary keys changed during iteration
                leaf = leaf_nodes.get(n)
                
                common_anc = node
                path1 = [node]

                if node.score == 0:
                    continue
                #finds common ancestor from node and saves path between them  
                #recurse from leaf and node until curr.score == 0 and compare the 2 curr
                #if currs are the same, common_anc = curr, else common_anc = base     
                while common_anc.name not in tree_list:
                    if common_anc.score != 0:
                        common_anc = common_anc.ancestor
                        path1.append(common_anc)
                    else:
                        break
                while common_anc.score != 0:
                    common_anc = common_anc.ancestor
                path1.reverse()
                # print("path1:",[n.name for n in path1])

                # finds path with len(path2) size from leaf upwards
                leaf_anc = leaf
                path2 = [leaf_anc]
                notValid = (leaf_anc.score == 0)
                while len(path1) != len(path2):
                    if leaf_anc.score == 0:
                        # "give up"
                        notValid = True
                        break
                    leaf_anc = leaf_anc.ancestor
                    path2.append(leaf_anc)
                path2.reverse()
                path2_names = [p2.name for p2 in path2]

                # skips leaf if path2 contains "cat_" w/o score
                if notValid:
                    print(f"!  {leaf.name}")
                    continue
                b = False
                for n in path1:
                    if n.name in path2_names:
                        if n.score == 0:
                            continue
                        print(f"!! {leaf.name} is leaf and common ancestor")
                        b = True
                if b is True or len(path1) == 1:
                    if len(path1) == 1:
                        print(f"! !{leaf.name}")
                    continue            

                # check if there is exactly 1 of select skill paths
                # cat_Personality: personality
                # cat_Religion: religion
                # cat_Clan: clan~ freed slave
                
                # current issue: 
                #       only takes first skill and ignores rest due to "not same path"
                
                # if common_anc and anc of leaf are the same and the anc is in the exclusive list, continue
                


                # compare(bigger is worse)
                if (dp[leaf.num] - dp[leaf_anc.num]) >= (dp[node.num] - dp[path1[0].num]):
                    # print(f"({curr.name} -> {leaf.name})[{dp[leaf.num]} - {dp[curr.num]}] > ({common_anc.name} -> {node.name})[{dp[node.num]} - {dp[path1[0].num]}]")
                    path2.pop(0)

                    # push node to front of leaf_nodes after adding
                    # after evaluating a cat_, need to sort by score

                    # error

                    # nonlocal exclusive_list
                    # if common_anc.name in exclusive_list:
                    #     # recurse back and see if ex_cat
                    #     if exclusive_list[common_anc.name] is None:
                    #         exclusive_list[common_anc.name] = node
                    #     else:
                    #         # recurse back and see if node is descendent of exclusive_list[common_anc]
                    #         cur = node
                    #         same_path = False
                    #         while cur.score != 0:
                    #             if cur.name == exclusive_list[common_anc.name].name:
                    #                 same_path = True
                    #                 exclusive_list[common_anc] = node
                    #                 break
                    #             else:
                    #                 cur = cur.ancestor
                    #         if not same_path:
                    #             print(f"Not same path as \'{exclusive_list[common_anc].name}\'")
                    #             break

                    print(f"--Added '{node.name}', Removed {path2_names}--")

                    # error: removing ancestors to add children
                    # --Added 'Legendary Trader', Removed [Well Dressed, Good with Money]--

                    # Update leaf_nodes
                    if tree_list[path2[0].name].ancestor:
                        a = tree_list[path2[0].name].ancestor
                        if a.score != 0 and not any(x in tree_list for x in a.children):
                            # iterate until curr.score == 0 to see if no anc exist as leaf
                            leaf_nodes[a.name] = a

                    # delete nodes (path2)
                    c = leaf
                    for _ in range(len(path2)):
                        del tree_list[c.name]
                        c = c.ancestor
                    
                    # add nodes (path1)
                    path1.pop(0)
                    for i in path1:
                        tree_list[i.name] = i

                    #update leaf_nodes cont.
                    del leaf_nodes[leaf.name]
                    new_entry = {node.name:node}
                    leaf_nodes = {**new_entry, **leaf_nodes}
                    # leaf_nodes[node.name] = node
                    # leaf_nodes.update({node.name: node})

                    # Iterate up node and ensure none of node's anc are leaves
                    c = node.ancestor
                    while c.score != 0:
                        if c.name in leaf_nodes.copy():
                            del leaf_nodes[c.name]
                        c = c.ancestor  
                    
                    print("     ", leaf_nodes.keys())  
                    break
                
                else:
                    print(f"!!!{leaf.name}")
                    # print("",end="")

            # need to change so sort occurs after cat_ encountered, or node.score == 0
            # sorted_items = sorted(leaf_nodes.items(), key=lambda x: x[1].score, reverse=True)
            # leaf_nodes = dict(sorted_items)
            print("",end="")

        else:
            print(f"-> Added {node.name}")
            if node.score != 0:
                tree_list[node.name] = node
                if leaf_nodes:
                    if node.ancestor.name in leaf_nodes.keys():
                        leaf_nodes.pop(node.ancestor.name)
                new_entry = {node.name:node}
                leaf_nodes = {**new_entry, **leaf_nodes}

        for child in node.children:
            dfs(child, depth + 1)
    dfs(root)
    print("------------------------------------------------------------")
    print_dict(tree_list)
    print_dict(leaf_nodes)
    return tree_list
    
def translate_to_graph(root):
    # use BFS
    if root is None:
        return
 
    queue = []
    queue.append(root)

    values = []
    adj_list = defaultdict(list)

    while queue:
        values.append(queue[0].score)
        if queue[0].ancestor:
            adj_list[queue[0].ancestor.name].append(queue[0].name)
            adj_list[queue[0].name].append(queue[0].ancestor.name)


        node = queue.pop(0)

        # Enqueue all children of the current node
        for child in node.children:
            queue.append(child)
    
    for node, neighbors in adj_list.items():
        print(f"Node ({node}) is connected to nodes {neighbors}")

    # find_path(a,v,u,parent,num_nodes):



head = TreeNode("base",["Level 1"],None)
node_list = []

if not os.path.isfile(file_path):
    open(file_path, "x")

if os.path.getsize(file_path) == 0:
    response = requests.get(url)
    response.raise_for_status()
    file = open(file_path, "wb")
    file.write(response.content)
    file.close()
    
    # Parse the HTML content with Beautiful Soup
    soup = BeautifulSoup(response.text, "html.parser")
    print("Read from webpage")
else:
    # Read from file if 
    with open(file_path, 'r', encoding='utf-8') as file:
        # Parse the HTML content of the file using Beautiful Soup
        soup = BeautifulSoup(file, 'html.parser')
    print("Read from file")
for class_name in class_list:
    # Find all HTML elements with the specified class
    elements_with_class = soup.find_all(class_=class_name)
    # print(f"\nText content from class '{class_name}':")
    class_node = TreeNode(class_name, ["Level 1"], None)
    add_node(head,class_node,None)
    for element in elements_with_class:
        # print(f"{element}")  # Use .strip() to remove leading/trailing whitespace
        name = element.find('h2').text
        # print(f"    {element.find('h4').text}")
        req = element.find('p').text[14:].split(", ")
        trait = element.find('p').find_next_sibling('p').find_next_sibling('p').text
        if len(trait) == 0: 
            trait = "N/A"
        
        # print(f"name: \"{name}\"")
        # print(f"    req: \"{req}\"")
        # print(f"    trait: \"{trait}\"")
        new_node = TreeNode(name, req, trait)
        node_list.append(new_node)
        add_trait(new_node)
    
    # sort the node list by req
    primary_sort(node_list)

    #loops unadded nodes to trees until added
    for node in node_list:
        add_node(class_node, node, node_list)
    node_list = []

size = assign_num(head)
# sorting alphabetically does not work, sort by convert to number then sort
for key in trait_dict:
    trait_dict[key].sort(key=lambda x: float(x.trait.split(" ", 1)[0].replace("%","")))

score_nodes(trait_dict)
# print_nary_tree(head, 0, True)

# path = []
# find_path(head, "Absorbed in Group", path)
# print_list(path,True)
find_cheapest_tree(head, 10, size)
# translate_to_graph(head)


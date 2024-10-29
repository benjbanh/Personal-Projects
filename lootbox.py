import random
import time

# LootBox odds
common_rarity = 60
uncommon_rarity = 25
rare_rarity = 10
legendary_rarity = 5

def open_lootbox (num):
    collection = {'common': 0, 'uncommon': 0, 'rare': 0, "legendary": 0}

    for _ in range(num):
        roll = random.randrange(0,100)
        rarity = common_rarity

        # Common
        if rarity < roll:
            rarity += uncommon_rarity
            # Uncommon
            if rarity < roll:
                rarity += rare_rarity
                # Rare
                if rarity < roll:
                    # Legendary
                    collection['legendary'] += 1
                    # print("legendary")
                else:
                    collection['rare'] += 1
                    # print("rare")
            else:
                collection['uncommon'] += 1
                # print("uncommon")
        else:
            collection['common'] += 1
            # print("common")
    
        # time.sleep(1)
    return collection

def main():
    ans = open_lootbox(10000)
    print(f"After 10 rolls, you got: {ans['common']} Commons, {ans['uncommon']} Uncommons, {ans['rare']} Rares, {ans['legendary']} Legendarys")

main()
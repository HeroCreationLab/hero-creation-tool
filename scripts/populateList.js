
/*
Author: Alexander Sedore
Date: 12/20/2020
Version: 0.2
Populate a selcelct dropdownlist based on id and filepath for a index json.
Input : ID: string, object: Json Array, isIndex: boolean, defaaultName: string
Output: N/A
*/
function populateList(id, object, isIndex, defaultName){
     //initialize drop down list and add default value
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = `Choose your ${defaultName}`;

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;

    let option;
    if (isIndex){
        for (a in object){
            option = document.createElement('option');
            option.text = a;
            option.value = a;
            dropdown.add(option);
        }
    } else{
        for (let obj of object){
            option = document.createElement('option');
            option.text = obj.name;
            option.value = JSON.stringify(obj);
            dropdown.add(option);
        }
    }

    option = document.createElement('option');
    option.text = 'Custom';
    option.value = 'Custom';
    dropdown.add(option);
}

/*
Author: Alexander Sedore
Date: 12/20/2020
Version: 0.1
Populate a spell selelect dropdownlist based on id, spell caster, the level of the caster and a given spell list.
Input : ID: string, spellClass: int, spellSubClass: string, level: int, spellList: jsonObject
*/
function populateSpellList(id, spellClassName, spellSubClassName, level, background, race, spellList){
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your spell';

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;

    let option;

    for (let spell of spellList){
        if (level == spell.level){
            if(isUsable(spellClassName, spellSubClassName, background, race, spell)){
                option = document.createElement('option');
                option.text = spell.name;
                option.value = JSON.stringify(spell);
                dropdown.add(option);
            }
        }
    }
}
/* 
Author: Alexander Sedore
Date: 12/20/2020
Version: 0.1
returns wether the class is capable of casting a spell based on class requirements/subclass requirements
Input: spellClassName: string, spellSubClassName: string, background: string, race: race, spellClassList: object
Output: boolean
*/
function isUsable(spellClassName, spellSubClassName, background, race, spell){
    //check the class list for the class name
    
    let classList = spell.classes.fromClassList;
    if(classList){
        for (let spellClass of classList){
            if (spellClass.name == spellClassName){
                return true;
            }
        }
    }
    //check the subclass list if available.
    let subClassList = spell.classes.fromSubClass;
    if (subClassList){
        for (let subSpellClass of subClassList){
            if (subSpellClass.class.name == spellClassName && subSpellClass.subclass.name == spellSubClassName){
                return true;
            }
        }
    }

    //check race list if available
    let raceList = spell.races;
    if (raceList){
        for (race of raceList){
            if (race == race.name){
                return true;
            }
        }
    }

    //check backgrounds if available
    let backgrounds = spell.backgrounds;
    if(backgrounds){
        for (back of backgrounds){
            if (background == back.name){
                return true;
            }
        }
    }
    return false;
}
/*
Author: Alexander Sedore
Date: 12/21/2020
Version: 0.2
This function only adds to a dropdownlist that you have ALREADY INITIALIZED DOES NOT RESET LIST***
Adds item to drop down list by id as based on either matching category and type or name
Input: 
string id: id property of dropdownlist
[object] items: list of item objects
string itemCategory: category description you are looking for such as 'martial', 'simple' ect 
string itemName: name of a specific item you are looking for
string itemType: the type of the object **case sensitive**:
    - R for ranged
    - M for melee
    - A for amminution
    - HA for heavy armour 
    - MA for medium armour
    - LA for light armour
    - SCF for spell casting focus's
string scfType: the type of spell casting focus **important** because druids cannot use 'arcane' focus's ect
boolean isMagicItem: wether or not you are looking for magic items
Output: N/A

Example:
>> populateItemList("here", items, '', '', 'SCF', 'druid', false)
    > search for all druidic spell casting focuses that are not magical items.
>> populateItemList("here", items, '', '', 'SCF', 'druid', true)
    > search for all magic druidical spell casting focuses
>> populateItemList("here", items, '', '', 'M', '', true)
    > search for all magical melee weapons
>>  populateItemList(id, items, '', '', 'M', '', false)
    > search for all melee weapons
>>  populateItemList(id, items, 'martial', '', 'M', '', true)
    > search for all magical martial melee weapons
>>  populateItemList(id, items, 'martial', '', '', '', false)
    > search for all martial weapons
>> populateItemList(id, items, '', '', '', '', true)
    > search for all magical weapons/items
*/

function populateItemList(id, items, itemCategory, itemName, itemType, scfType, isMagicItem){
    let option;
    let listOfItems = [];
    //Looking for specific item
    if (itemName != ''){
        for (item of items){
            if (itemName == item.name){
                /*option = document.createElement('option');
                option.name = itemName;
                option.value = JSON.stringify(item);
                dropdown.add(option);*/
                //itemsList.push(item);
                return listOfItems;
            }
        }
        console.log(`No item with name: ${itemName}`);
    //Looking for any item of given type (if type exists but category doesn't)
    } else if ((itemType != '') && (itemCategory == '')){
        for (item of items){
            //check for SCF
            if (itemType == 'SCF'){
                if (item.type == 'SCF'){
                    if (scfType == ''){
                        //looking for any magic item of given type
                        if ((isMagicItem == true) && (item.rarity != 'none')){
                                /*option = document.createElement('option');
                                option.name = itemName;
                                option.value = JSON.stringify(item);
                                dropdown.add(option);*/
                                listOfItems.push(item);
                        //looking for any non magic item of given type 
                        } else if ((isMagicItem == false) && (item.rarity == 'none')){
                                /*option = document.createElement('option');
                                option.name = itemName;
                                option.value = JSON.stringify(item);
                                dropdown.add(option);*/
                                listOfItems.push(item);
                        }
                    }else{
                         //looking for any magic item of given type
                         if ((isMagicItem == true) && (item.rarity != 'none')){
                            if (item.scfType == scfType){
                                /*option = document.createElement('option');
                                option.name = itemName;
                                option.value = JSON.stringify(item);
                                dropdown.add(option);*/
                                listOfItems.push(item);
                            }
                        //looking for any non magic item of given type 
                        } else if ((isMagicItem == false) && (item.rarity == 'none')){
                            if (item.scfType == scfType){
                                /*option = document.createElement('option');
                                option.name = itemName;
                                option.value = JSON.stringify(item);
                                dropdown.add(option);*/
                                listOfItems.push(item);
                            }
                        }
                    } 
                }
            //type != SCF
            }else{
                //looking for any magic item of given type 
                if ((isMagicItem == true) && (item.rarity != 'none')){
                    if (item.type == itemType){
                        /*option = document.createElement('option');
                        option.name = itemName;
                        option.value = JSON.stringify(item);
                        dropdown.add(option);*/
                        listOfItems.push(item);
                    }
                //looking for any non magic item of given type 
                } else if ((isMagicItem == false) && (item.rarity == 'none')){
                    if (item.type == itemType){
                        /*option = document.createElement('option');
                        option.name = itemName;
                        option.value = JSON.stringify(item);
                        dropdown.add(option);*/
                        listOfItems.push(item);
                    }
                }
            }
        }
    //looking for any item of given category (if no type category but category exists)
    } else if ((itemType == '') && (itemCategory != '')){
        for (item of items){            
            //null check for weaponCategory
            if(item.weaponCategory){
                //looking for any magic item of given category
                if ((isMagicItem == true) && (item.rarity != 'none')){
                    if (item.weaponCategory == itemCategory){
                        /*option = document.createElement('option');
                        option.name = itemName;
                        option.value = JSON.stringify(item);
                        dropdown.add(option);*/
                        listOfItems.push(item);
                    }
                //looking for any non magic item of given category 
                } else if ((isMagicItem == false) && (item.rarity == 'none')){
                    if (item.weaponCategory == itemCategory){
                        /*option = document.createElement('option');
                        option.name = itemName;
                        option.value = JSON.stringify(item);
                        dropdown.add(option);*/
                        listOfItems.push(item);
                    }
                }
            }
        }
    //looking for spefic items with given category
    } else if (itemType != '' && itemCategory != '') {
        for (item of items){ 
            //check if category exists
            if (item.weaponCategory){
                //check for SCF
                //check itemType == SCF
                if (itemType == 'SCF'){
                    if (item.type == 'SCF'){
                        if (scfType == ''){
                            //looking for any magic item of given type
                            if ((isMagicItem == true) && (item.rarity != 'none')){
                                if (itemCategory == item.weaponCategory){
                                    /*option = document.createElement('option');
                                    option.name = itemName;
                                    option.value = JSON.stringify(item);
                                    dropdown.add(option);*/
                                    listOfItems.push(item);
                                }
                            //looking for any non magic item of given type 
                            } else if ((isMagicItem == false) && (item.rarity == 'none')){
                                if (itemCategory == item.weaponCategory){
                                    /*option = document.createElement('option');
                                    option.name = itemName;
                                    option.value = JSON.stringify(item);
                                    dropdown.add(option);*/
                                    listOfItems.push(item);
                                }
                            }
                        }else{
                             //looking for any magic item of given type
                             if ((isMagicItem == true) && (item.rarity != 'none')){
                                if (item.scfType == scfType && itemCategory == item.weaponCategory){
                                    /*option = document.createElement('option');
                                    option.name = itemName;
                                    option.value = JSON.stringify(item);
                                    dropdown.add(option);*/
                                    listofItems.push(item);
                                }
                            //looking for any non magic item of given type 
                            } else if ((isMagicItem == false) && (item.rarity == 'none')){
                                if (item.scfType == scfType && itemCategory == item.weaponCategory){
                                    /*option = document.createElement('option');
                                    option.name = itemName;
                                    option.value = JSON.stringify(item);
                                    dropdown.add(option);*/
                                    listOfItems.push(item);
                                }
                            }
                        } 
                    }
                //itemType != SCF
                } else {
                    //looking for any magic item of spefic items with given category
                    if ((isMagicItem == true) && (item.rarity != 'none')){
                        if ((item.type == itemType) && (item.weaponCategory == itemCategory)){
                            /*option = document.createElement('option');
                            option.name = itemName;
                            option.value = JSON.stringify(item);
                            dropdown.add(option);*/
                            listOfItems.push(item);
                        }
                    //looking for any non magic item of spefic items with given category
                    } else if ((isMagicItem == false) && (item.rarity == 'none')){
                        if ((item.type == itemType) && (item.weaponCategory == itemCategory)){
                            /*option = document.createElement('option');
                            option.name = itemName;
                            option.value = JSON.stringify(item);
                            dropdown.add(option);*/
                            listOfItems.push(item);
                        }
                    }
                }
            }
        }
    //filter by isMagicItem
    }else {
        for (item of items){
            if (isMagicItem == true && item.rarity != 'none'){
                /*option = document.createElement('option');
                option.name = itemName;
                option.value = JSON.stringify(item);
                dropdown.add(option);*/
                listOfItems.push(item);
            } else if (isMagicItem == false && item.rarity == 'none'){
                /*option = document.createElement('option');
                option.name = itemName;
                option.value = JSON.stringify(item);
                dropdown.add(option);*/
                listOfItems.push(item);
            }
        }
    }
    if (listOfItems == []){
        console.log("Could not find item with given parameters.");
    }
    return listOfItems;
}
/*
Author: Alexander Sedore
Date: 12/20/2020
Version: 0.1
Initialize a drop down list based on ID. USE TO RESET YOUR SELECTOR.
Input: id: string
Output: N/A
*/
function initializeItemList(id){
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your item';

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;
}
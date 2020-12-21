classObj={
    "class": {
        "name": "Wizard",
        "source": "PHB",
        "page": 112,
        "srd": true,
        "hd": {
            "number": 1,
            "faces": 6
        },
        "proficiency": [
            "int",
            "wis"
        ],
        "spellcastingAbility": "int",
        "casterProgression": "full",
        "startingProficiencies": {
            "weapons": [
                "daggers",
                "darts",
                "slings",
                "quarterstaffs",
                "light crossbows"
            ],
            "skills": [
                {
                    "choose": {
                        "from": [
                            "arcana",
                            "history",
                            "insight",
                            "investigation",
                            "medicine",
                            "religion"
                        ],
                        "count": 2
                    }
                }
            ]
        },
        "startingEquipment": {
            "additionalFromBackground": true,
            "default": [
                "(a) a {@item quarterstaff|phb} or (b) a {@item dagger|phb}",
                "(a) a {@item component pouch|phb} or (b) an {@item arcane focus|phb}",
                "(a) a {@item scholar's pack|phb} or (b) an {@item explorer's pack|phb}",
                "A {@item spellbook|phb}"
            ],
            "goldAlternative": "{@dice 4d4 × 10|4d4 × 10|Starting Gold}",
            "defaultData": [
                {
                    "a": [
                        "quarterstaff|phb"
                    ],
                    "b": [
                        "dagger|phb"
                    ]
                },
                {
                    "a": [
                        "component pouch|phb"
                    ],
                    "b": [
                        "arcane focus|phb"
                    ]
                },
                {
                    "a": [
                        "scholar's pack|phb"
                    ],
                    "b": [
                        "explorer's pack|phb"
                    ]
                },
                {
                    "_": [
                        "spellbook|phb"
                    ]
                }
            ]
        },
        "multiclassing": {
            "requirements": {
                "int": 13
            }
        },
        "classTableGroups": [
            {
                "colLabels": [
                    "{@filter Cantrips Known|spells|level=0|class=Wizard}"
                ],
                "rows": [
                    [
                        3
                    ],
                    [
                        3
                    ],
                    [
                        3
                    ],
                    [
                        4
                    ],
                    [
                        4
                    ],
                    [
                        4
                    ],
                    [
                        4
                    ],
                    [
                        4
                    ],
                    [
                        4
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ],
                    [
                        5
                    ]
                ]
            },
            {
                "title": "Spell Slots per Spell Level",
                "colLabels": [
                    "{@filter 1st|spells|level=1|class=Wizard}",
                    "{@filter 2nd|spells|level=2|class=Wizard}",
                    "{@filter 3rd|spells|level=3|class=Wizard}",
                    "{@filter 4th|spells|level=4|class=Wizard}",
                    "{@filter 5th|spells|level=5|class=Wizard}",
                    "{@filter 6th|spells|level=6|class=Wizard}",
                    "{@filter 7th|spells|level=7|class=Wizard}",
                    "{@filter 8th|spells|level=8|class=Wizard}",
                    "{@filter 9th|spells|level=9|class=Wizard}"
                ],
                "rows": [
                    [
                        2,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        3,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        2,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        2,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        2,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        1,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        0,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        0,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        1,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        1,
                        0
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        1,
                        1
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        3,
                        1,
                        1,
                        1,
                        1
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        3,
                        2,
                        1,
                        1,
                        1
                    ],
                    [
                        4,
                        3,
                        3,
                        3,
                        3,
                        2,
                        2,
                        1,
                        1
                    ]
                ]
            }
        ],
        "classFeatures": [
            "Arcane Recovery|Wizard||1",
            "Spellcasting|Wizard||1",
            "Cantrip Versatility|Wizard||1|UAClassFeatureVariants",
            {
                "classFeature": "Arcane Tradition|Wizard||2",
                "gainSubclassFeature": true
            },
            "Cantrip Formulas|Wizard||3|TCE",
            "Ability Score Improvement|Wizard||4",
            "Proficiency Versatility|Wizard||4|UAClassFeatureVariants",
            {
                "classFeature": "Arcane Tradition feature|Wizard||6",
                "gainSubclassFeature": true
            },
            "Ability Score Improvement|Wizard||8",
            "Proficiency Versatility|Wizard||8|UAClassFeatureVariants",
            {
                "classFeature": "Arcane Tradition feature|Wizard||10",
                "gainSubclassFeature": true
            },
            "Ability Score Improvement|Wizard||12",
            "Proficiency Versatility|Wizard||12|UAClassFeatureVariants",
            {
                "classFeature": "Arcane Tradition feature|Wizard||14",
                "gainSubclassFeature": true
            },
            "Ability Score Improvement|Wizard||16",
            "Proficiency Versatility|Wizard||16|UAClassFeatureVariants",
            "Spell Mastery|Wizard||18",
            "Ability Score Improvement|Wizard||19",
            "Proficiency Versatility|Wizard||19|UAClassFeatureVariants",
            "Signature Spells|Wizard||20"
        ],
        "subclassTitle": "Arcane Tradition",
        "subclasses": [
            {
                "name": "School of Evocation",
                "shortName": "Evocation",
                "source": "PHB",
                "page": 117,
                "srd": true,
                "subclassFeatures": [
                    "School of Evocation|Wizard||Evocation||2",
                    "Potent Cantrip|Wizard||Evocation||6",
                    "Empowered Evocation|Wizard||Evocation||10",
                    "Overchannel|Wizard||Evocation||14"
                ]
            }
        ],
        "fluff": [
            {
                "name": "Wizard",
                "type": "section",
                "entries": [
                    "Clad in the silver robes that denote her station, an elf closes her eyes to shut out the distractions of the battlefield and begins her quiet chant. Fingers weaving in front of her, she completes her spell and launches a tiny bead of fire toward the enemy ranks, where it erupts into a conflagration that engulfs the soldiers.",
                    "Checking and rechecking his work, a human scribes an intricate magic circle in chalk on the bare stone floor, then sprinkles powdered iron along every line and graceful curve. When the circle is complete, he drones a long incantation. A hole opens in space inside the circle, bringing a whiff of brimstone from the otherworldly plane beyond.",
                    "Crouching on the floor in a dungeon intersection, a gnome tosses a handful of small bones inscribed with mystic symbols, muttering a few words of power over them. Closing his eyes to see the visions more clearly, he nods slowly, then opens his eyes and points down the passage to his left.",
                    "Wizards are supreme magic-users, defined and united as a class by the spells they cast. Drawing on the subtle weave of magic that permeates the cosmos, wizards cast spells of explosive fire, arcing lightning, subtle deception, and brute-force mind control. Their magic conjures monsters from other planes of existence, glimpses the future, or turns slain foes into zombies. Their mightiest spells change one substance into another, call meteors down from the sky, or open portals to other worlds.",
                    {
                        "type": "entries",
                        "name": "Scholars of the Arcane",
                        "entries": [
                            "Wild and enigmatic, varied in form and function, the power of magic draws students who seek to master its mysteries. Some aspire to become like the gods, shaping reality itself. Though the casting of a typical spell requires merely the utterance of a few strange words, fleeting gestures, and sometimes a pinch or clump of exotic materials, these surface components barely hint at the expertise attained after years of apprenticeship and countless hours of study.",
                            "Wizards live and die by their spells. Everything else is secondary. They learn new spells as they experiment and grow in experience. They can also learn them from other wizards, from ancient tomes or inscriptions, and from ancient creatures (such as the fey) that are steeped in magic."
                        ]
                    },
                    {
                        "type": "entries",
                        "name": "The Lure of Knowledge",
                        "entries": [
                            "Wizards' lives are seldom mundane. The closest a wizard is likely to come to an ordinary life is working as a sage or lecturer in a library or university, teaching others the secrets of the multiverse. Other wizards sell their services as diviners, serve in military forces, or pursue lives of crime or domination.",
                            "But the lure of knowledge and power calls even the most unadventurous wizards out of the safety of their libraries and laboratories and into crumbling ruins and lost cities. Most wizards believe that their counterparts in ancient civilizations knew secrets of magic that have been lost to the ages, and discovering those secrets could unlock the path to a power greater than any magic available in the present age."
                        ]
                    },
                    {
                        "type": "entries",
                        "name": "Creating a Wizard",
                        "entries": [
                            "Creating a wizard character demands a backstory dominated by at least one extraordinary event. How did your character first come into contact with magic? How did you discover you had an aptitude for it? Do you have a natural talent, or did you simply study hard and practice incessantly? Did you encounter a magical creature or an ancient tome that taught you the basics of magic?",
                            "What drew you forth from your life of study? Did your first taste of magical knowledge leave you hungry for more? Have you received word of a secret repository of knowledge not yet plundered by any other wizard? Perhaps you're simply eager to put your newfound magical skills to the test in the face of danger.",
                            {
                                "type": "entries",
                                "name": "Quick Build",
                                "entries": [
                                    "You can make a wizard quickly by following these suggestions. First, Intelligence should be your highest ability score, followed by Constitution or Dexterity. If you plan to join the School of Enchantment, make Charisma your next-best score. Second, choose the {@background sage} background. Third, choose the {@spell mage hand}, {@spell light}, and {@spell ray of frost} cantrips, along with the following 1st-level spells for your spellbook: {@spell burning hands}, {@spell charm person}, {@spell feather fall}, {@spell mage armor}, {@spell magic missile}, and {@spell sleep}."
                                ]
                            }
                        ]
                    }
                ],
                "page": 112,
                "source": "PHB"
            },
            {
                "type": "section",
                "entries": [
                    {
                        "type": "quote",
                        "entries": [
                            "Wizardry requires understanding. The knowledge of how and why magic works, and our efforts to broaden that understanding, have brought about the key advances in civilization over the centuries."
                        ],
                        "by": "Gimble the illusionist"
                    },
                    "Only a select few people in the world are wielders of magic. Of all those, wizards stand at the pinnacle of the craft. Even the least of them can manipulate forces that flout the laws of nature, and the most accomplished among them can cast spells with world-shaking effects.",
                    "The price that wizards pay for their mastery is that most valuable of commodities: time. It takes years of study, instruction, and experimentation to learn how to harness magical energy and carry spells around in one's own mind. For adventuring wizards and other spellcasters who aspire to the highest echelons of the profession, the studying never ends, nor does the quest for knowledge and power.",
                    "If you're playing a wizard, take advantage of the opportunity to make your character more than just a stereotypical spell-slinger. Use the advice that follows to add some intriguing details to how your wizard interacts with the world.",
                    {
                        "type": "entries",
                        "name": "Spellbook",
                        "entries": [
                            "Your wizard character's most prized possession—your spellbook—might be an innocuous-looking volume whose covers show no hint of what's inside. Or you might display some flair, as many wizards do, by carrying a spellbook of an unusual sort. If you don't own such an item already, one of your goals might be to find a spellbook that sets you apart by its appearance or its means of manufacture.",
                            {
                                "type": "table",
                                "caption": "Spellbooks",
                                "colLabels": [
                                    "{@dice d6}",
                                    "Spellbook"
                                ],
                                "colStyles": [
                                    "col-1 text-center",
                                    "col-11"
                                ],
                                "rows": [
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 1
                                            }
                                        },
                                        "A tome with pages that are thin sheets of metal, spells etched into them with acid"
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 2
                                            }
                                        },
                                        "Long straps of leather on which spells are written, wrapped around a staff for ease of transport"
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 3
                                            }
                                        },
                                        "A battered tome filled with pictographs that only you can understand"
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 4
                                            }
                                        },
                                        "Small stones inscribed with spells and kept in a cloth bag"
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 5
                                            }
                                        },
                                        "A scorched book, ravaged by dragon fire, with the script of your spells barely visible on its pages"
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 6
                                            }
                                        },
                                        "A tome full of black pages whose writing is visible only in dim light or darkness"
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "type": "entries",
                        "name": "Ambition",
                        "entries": [
                            "Few aspiring wizards undertake the study of magic without some personal goal in mind. Many wizards use their spells as a tool to produce a tangible benefit, in material goods or in status, for themselves or their companions. For others, the theoretical aspect of magic might have a strong appeal, pushing those wizards to seek out knowledge that supports new theories of the arcane or confirms old ones.",
                            "Beyond the obvious, why does your wizard character study magic, and what do you want to achieve? If you haven't given these questions much thought, you can do so now, and the answers you come up with will likely affect how your future unfolds.",
                            {
                                "type": "table",
                                "caption": "Ambitions",
                                "colLabels": [
                                    "{@dice d6}",
                                    "Ambition"
                                ],
                                "colStyles": [
                                    "col-1 text-center",
                                    "col-11"
                                ],
                                "rows": [
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 1
                                            }
                                        },
                                        "You will prove that the gods aren't as powerful as folk believe."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 2
                                            }
                                        },
                                        "Immortality is the end goal of your studies."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 3
                                            }
                                        },
                                        "If you can fully understand magic, you can unlock its use for all and usher in an era of equality."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 4
                                            }
                                        },
                                        "Magic is a dangerous tool. You use it to protect what you treasure."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 5
                                            }
                                        },
                                        "Arcane power must be taken away from those who would abuse it."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 6
                                            }
                                        },
                                        "You will become the greatest wizard the world has seen in generations."
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "type": "entries",
                        "name": "Eccentricity",
                        "entries": [
                            "Endless hours of solitary study and research can have a negative effect on anyone's social skills. Wizards, who are a breed apart to begin with, are no exception. An odd mannerism or two is not necessarily a drawback, though; an eccentricity of this sort is usually harmless and could provide a source of amusement or serve as a calling card of sorts.",
                            "If your character has an eccentricity, is it a physical tic or a mental one? Are you well known in some circles because of it? Do you fight to overcome it, or do you embrace this minor claim to fame of yours?",
                            {
                                "type": "table",
                                "caption": "Eccentricities",
                                "colLabels": [
                                    "{@dice d6}",
                                    "Eccentricity"
                                ],
                                "colStyles": [
                                    "col-1 text-center",
                                    "col-11"
                                ],
                                "rows": [
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 1
                                            }
                                        },
                                        "You have the habit of tapping your foot incessantly, which often annoys those around you."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 2
                                            }
                                        },
                                        "Your memory is quite good, but you have no trouble pretending to be absentminded when it suits your purposes."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 3
                                            }
                                        },
                                        "You never enter a room without looking to see what's hanging from the ceiling."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 4
                                            }
                                        },
                                        "Your most prized possession is a dead worm that you keep inside a potion vial."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 5
                                            }
                                        },
                                        "When you want people to leave you alone, you start talking to yourself. That usually does the trick."
                                    ],
                                    [
                                        {
                                            "type": "cell",
                                            "roll": {
                                                "exact": 6
                                            }
                                        },
                                        "Your fashion sense and grooming, or more accurately lack thereof, sometimes cause others to assume you are a beggar."
                                    ]
                                ]
                            }
                        ]
                    }
                ],
                "page": 58,
                "source": "XGE"
            }
        ]
    },
    "classFeature": [
        {
            "name": "Arcane Recovery",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 1,
            "entries": [
                "You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.",
                "For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots.",
                "You can recover either a 2nd-level spell slot or two 1st-level spell slots."
            ]
        },
        {
            "name": "Spellcasting",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 1,
            "entries": [
                "As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. See {@book chapter 10|PHB|10} for the general rules of spellcasting and {@book chapter 11|PHB|11} for the {@filter wizard spell list|spells|class=wizard}.",
                {
                    "type": "entries",
                    "name": "Cantrips",
                    "entries": [
                        "At 1st level, you know three cantrips of your choice from the wizard spell list. You learn additional wizard cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Wizard table."
                    ]
                },
                {
                    "type": "entries",
                    "name": "Spellbook",
                    "entries": [
                        "At 1st level, you have a spellbook containing six 1st-level {@filter wizard spells|spells|class=wizard} of your choice. Your spellbook is the repository of the wizard spells you know, except your cantrips, which are fixed in your mind."
                    ]
                },
                {
                    "type": "entries",
                    "name": "Preparing and Casting Spells",
                    "entries": [
                        "The Wizard table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest.",
                        "You prepare the list of wizard spells that are available for you to cast. To do so, choose a number of wizard spells from your spellbook equal to your Intelligence modifier + your wizard level (minimum of one spell). The spells must be of a level for which you have spell slots.",
                        "For example, if you're a 3rd-level wizard, you have four 1st-level and two 2nd-level spell slots. With an Intelligence of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination, chosen from your spellbook. If you prepare the 1st-level spell {@spell magic missile}, you can cast it using a 1st-level or a 2nd-level slot. Casting the spell doesn't remove it from your list of prepared spells.",
                        "You can change your list of prepared spells when you finish a long rest. Preparing a new list of wizard spells requires time spent studying your spellbook and memorizing the incantations and gestures you must make to cast the spell: at least 1 minute per spell level for each spell on your list."
                    ]
                },
                {
                    "type": "entries",
                    "name": "Spellcasting Ability",
                    "entries": [
                        "Intelligence is your spellcasting ability for your wizard spells, since you learn your wizard spells through dedicated study and memorization. You use your Intelligence whenever a spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for a wizard spell you cast and when making an attack roll with one.",
                        {
                            "type": "abilityDc",
                            "name": "Spell",
                            "attributes": [
                                "int"
                            ]
                        },
                        {
                            "type": "abilityAttackMod",
                            "name": "Spell",
                            "attributes": [
                                "int"
                            ]
                        }
                    ]
                },
                {
                    "type": "entries",
                    "name": "Ritual Casting",
                    "entries": [
                        "You can cast a wizard spell as a ritual if that spell has the ritual tag and you have the spell in your spellbook. You don't need to have the spell prepared."
                    ]
                },
                {
                    "type": "entries",
                    "name": "Spellcasting Focus",
                    "entries": [
                        "You can use an {@item arcane focus|phb} as a spellcasting focus for your wizard spells."
                    ]
                },
                {
                    "type": "entries",
                    "name": "Learning Spells of 1st Level and Higher",
                    "entries": [
                        "Each time you gain a wizard level, you can add two wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown on the Wizard table. On your adventures, you might find other spells that you can add to your spellbook (see \"Your Spellbook\")."
                    ]
                },
                {
                    "type": "inset",
                    "name": "Your Spellbook",
                    "entries": [
                        "The spells that you add to your spellbook as you gain levels reflect the arcane research you conduct on your own, as well as intellectual breakthroughs you have had about the nature of the multiverse. You might find other spells during your adventures. You could discover a spell recorded on a scroll in an evil wizard's chest, for example, or in a dusty tome in an ancient library.",
                        "A spellbook doesn't contain cantrips.",
                        {
                            "type": "entries",
                            "entries": [
                                {
                                    "type": "entries",
                                    "name": "Copying a Spell into the Book",
                                    "entries": [
                                        "When you find a wizard spell of 1st level or higher, you can add it to your spellbook if it is of a spell level you can prepare and if you can spare the time to decipher and copy it.",
                                        "Copying a spell into your spellbook involves reproducing the basic form of the spell, then deciphering the unique system of notation used by the wizard who wrote it. You must practice the spell until you understand the sounds or gestures required, then transcribe it into your spellbook using your own notation.",
                                        "For each level of the spell, the process takes 2 hours and costs 50 gp. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it. Once you have spent this time and money, you can prepare the spell just like your other spells.",
                                        "A wizard spell on a spell scroll can be copied just as spells in spellbooks can be copied. When you copy a spell from a spell scroll, you must succeed on an Intelligence ({@skill Arcana}) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the spell scroll is destroyed."
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "entries",
                            "entries": [
                                {
                                    "type": "entries",
                                    "name": "Replacing the Book",
                                    "entries": [
                                        "You can copy a spell from your own spellbook into another book—for example, if you want to make a backup copy of your spellbook. This is just like copying a new spell into your spellbook, but faster and easier, since you understand your own notation and already know how to cast the spell. You need spend only 1 hour and 10 gp for each level of the copied spell.",
                                        "If you lose your spellbook, you can use the same procedure to transcribe the spells that you have prepared into a new spellbook. Filling out the remainder of your spellbook requires you to find new spells to do so, as normal. For this reason, many wizards keep backup spellbooks in a safe place."
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "entries",
                            "entries": [
                                {
                                    "type": "entries",
                                    "name": "The Book's Appearance",
                                    "entries": [
                                        "Your spellbook is a unique compilation of spells, with its own decorative flourishes and margin notes. It might be a plain, functional leather volume that you received as a gift from your master, a finely bound gilt-edged tome you found in an ancient library, or even a loose collection of notes scrounged together after you lost your previous spellbook in a mishap."
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Arcane Tradition",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 2,
            "entries": [
                "When you reach 2nd level, you choose an arcane tradition from the list of available traditions, shaping your practice of magic. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
            ]
        },
        {
            "name": "Ability Score Improvement",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 4,
            "entries": [
                "When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "If your DM allows the use of feats, you may instead take a {@5etools feat|feats.html}."
            ]
        },
        {
            "name": "Arcane Tradition feature",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 6,
            "entries": [
                "At 6th level, you gain a feature granted by your Arcane Tradition."
            ]
        },
        {
            "name": "Ability Score Improvement",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 8,
            "entries": [
                "When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "If your DM allows the use of feats, you may instead take a {@5etools feat|feats.html}."
            ]
        },
        {
            "name": "Arcane Tradition feature",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 10,
            "entries": [
                "At 10th level, you gain a feature granted by your Arcane Tradition."
            ]
        },
        {
            "name": "Ability Score Improvement",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 12,
            "entries": [
                "When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "If your DM allows the use of feats, you may instead take a {@5etools feat|feats.html}."
            ]
        },
        {
            "name": "Arcane Tradition feature",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 14,
            "entries": [
                "At 14th level, you gain a feature granted by your Arcane Tradition."
            ]
        },
        {
            "name": "Ability Score Improvement",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 16,
            "entries": [
                "When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "If your DM allows the use of feats, you may instead take a {@5etools feat|feats.html}."
            ]
        },
        {
            "name": "Spell Mastery",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 18,
            "entries": [
                "At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.",
                "By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels."
            ]
        },
        {
            "name": "Ability Score Improvement",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 19,
            "entries": [
                "When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
                "If your DM allows the use of feats, you may instead take a {@5etools feat|feats.html}."
            ]
        },
        {
            "name": "Signature Spells",
            "source": "PHB",
            "page": 112,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "level": 20,
            "entries": [
                "When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.",
                "If you want to cast either spell at a higher level, you must expend a spell slot as normal."
            ]
        }
    ],
    "subclassFeature": [
        {
            "name": "School of Evocation",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 2,
            "entries": [
                "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some evokers find employment in military forces, serving as artillery to blast enemy armies from afar. Others use their spectacular power to protect the weak, while some seek their own gain as bandits, adventurers, or aspiring tyrants.",
                {
                    "type": "refSubclassFeature",
                    "subclassFeature": "Evocation Savant|Wizard||Evocation||2"
                },
                {
                    "type": "refSubclassFeature",
                    "subclassFeature": "Sculpt Spells|Wizard||Evocation||2"
                }
            ]
        },
        {
            "name": "Evocation Savant",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 2,
            "header": 1,
            "entries": [
                "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved."
            ]
        },
        {
            "name": "Sculpt Spells",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 2,
            "header": 1,
            "entries": [
                "Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save."
            ]
        },
        {
            "name": "Potent Cantrip",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 6,
            "header": 2,
            "entries": [
                "Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip."
            ]
        },
        {
            "name": "Empowered Evocation",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 10,
            "header": 2,
            "entries": [
                "Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast."
            ]
        },
        {
            "name": "Overchannel",
            "source": "PHB",
            "page": 117,
            "srd": true,
            "className": "Wizard",
            "classSource": "PHB",
            "subclassShortName": "Evocation",
            "subclassSource": "PHB",
            "level": 14,
            "header": 2,
            "entries": [
                "Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th-level that deals damage, you can deal maximum damage with that spell.",
                "The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take {@damage 2d12} necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by {@dice 1d12}. This damage ignores resistance and immunity."
            ]
        }
    ]
};


function getClassWizard(){
    return classObj;
}
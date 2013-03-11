SuperSpaceBattleYeah
====================

Super Space Battle Yeah is a deliberately rubbish top-to-bottom scrolling space shoot 'em.

I used it as one of the projects for my students in Computer Club.

Task 1 was to get the guns working, by adding to line `231` in `game.js`:

    if(jaws.pressed("space"))    { ship.shoot() }

Nice and simple!

From there, the fun task was to create **waaay** better graphics than I made
(I spent literally seconds creating the level backgrounds and monster. Sadly, I spent a
good hour or 2 on the ship :( )

More levels can be created, they need to be named to the same format as the existing ones
and the `max_levels` global needs to reflect the number of levels. A later task was to use
code similar to the level loading to load in a different monster for the end of each level.

Monster also needs an attack, and the player needs some way (other than crashing) to be destroyed!

Enjoy!
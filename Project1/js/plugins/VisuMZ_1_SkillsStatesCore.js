//=============================================================================
// VisuStella MZ - Skills & States Core
// VisuMZ_1_SkillsStatesCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_SkillsStatesCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.SkillsStatesCore = VisuMZ.SkillsStatesCore || {};
VisuMZ.SkillsStatesCore.version = 1.52;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.52] [SkillsStatesCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Skills_and_States_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Skills & States Core plugin extends and builds upon the functionality of
 * RPG Maker MZ's inherent skill, state, and buff functionalities and allows
 * game devs to customize its various aspects.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Assigning multiple Skill Types to Skills.
 * * Making custom Skill Cost Types (such as HP, Gold, and Items).
 * * Allowing Skill Costs to become percentile-based or dynamic either directly
 *   through the Skills themselves or through trait-like notetags.
 * * Replacing gauges for different classes to display different types of
 *   Skill Cost Type resources.
 * * Hiding/Showing and enabling/disabling skills based on switches, learned
 *   skills, and code.
 * * Setting rulings for states, including if they're cleared upon death, how
 *   reapplying the state affects their turn count, and more.
 * * Allowing states to be categorized and affected by categories, too.
 * * Displaying turn counts on states drawn in the window or on sprites.
 * * Manipulation of state, buff, and debuff turns through skill and item
 *   effect notetags.
 * * Create custom damage over time state calculations through notetags.
 * * Allow database objects to apply passive states to its user.
 * * Passive states can have conditions before they become active as well.
 * * Updated Skill Menu Scene layout to fit more modern appearances.
 * * Added bonus if Items & Equips Core is installed to utilize the Shop Status
 *   Window to display skill data inside the Skill Menu.
 * * Control over various aspects of the Skill Menu Scene.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 1 ------
 *
 * This plugin is a Tier 1 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 * 
 * Action End Removal for States
 * 
 * - If your Plugin Parameter settings for "Action End Update" are enabled,
 * then "Action End" has been updated so that it actually applies per action
 * used instead of just being at the start of a battler's action set.
 * 
 * - However, there are side effects to this: if a state has the "Cannot Move"
 * restriction along with the "Action End" removal timing, then unsurprisingly,
 * the state will never wear off because it's now based on actual actions
 * ending. To offset this and remove confusion, "Action End" auto-removal
 * timings for states with "Cannot Move" restrictions will be turned into
 * "Turn End" auto-removal timings while the "Action End Update" is enabled.
 * 
 * - This automatic change won't make it behave like an "Action End" removal
 * timing would, but it's better than completely softlocking a battler.
 * 
 * EXAMPLE:
 * 
 * - The new state: "Fiery Blade" will allow the affected battler to deal fire
 * elemental damage. With Action End, this means for 5 actions, those attacks
 * will deal fire damage.
 * 
 * - This means that if no action is taken, due to a status effect like "Sleep"
 * or "Stun", then the duration count will not decrease.
 * 
 * - On the flip side, if the battler performs multiple actions a turn, then
 * the duration count drops faster because more actions have been spent.
 * 
 * - However, if this "Fiery Blade" state was using Turn End instead, it will
 * have its duration reduced by 1 each turn, regardless of "Sleep" or "Stun"
 * states, and regardless of how many actions are performed each turn.
 * 
 * ---
 *
 * Buff & Debuff Level Management
 *
 * - In RPG Maker MZ, buffs and debuffs when applied to one another will shift
 * the buff modifier level up or down. This plugin will add an extra change to
 * the mechanic by making it so that once the buff modifier level reaches a
 * neutral point, the buff or debuff is removed altogether and resets the buff
 * and debuff turn counter for better accuracy.
 *
 * ---
 *
 * Skill Costs
 *
 * - In RPG Maker MZ, skill costs used to be hard-coded. Now, all Skill Cost
 * Types are now moved to the Plugin Parameters, including MP and TP. This
 * means that from payment to checking for them, it's all done through the
 * options available.
 *
 * - By default in RPG Maker MZ, displayed skill costs would only display only
 * one type: TP if available, then MP. If a skill costs both TP and MP, then
 * only TP was displayed. This plugin changes that aspect by displaying all the
 * cost types available in order of the Plugin Parameter Skill Cost Types.
 *
 * - By default in RPG Maker MZ, displayed skill costs were only color-coded.
 * This plugin changes that aspect by displaying the Skill Cost Type's name
 * alongside the cost. This is to help color-blind players distinguish what
 * costs a skill has.
 *
 * ---
 *
 * Sprite Gauges
 *
 * - Sprite Gauges in RPG Maker MZ by default are hard-coded and only work for
 * HP, MP, TP, and Time (used for ATB). This plugin makes it possible for them
 * to be customized through the use of Plugin Parameters under the Skill Cost
 * Types and their related-JavaScript entries.
 *
 * ---
 * 
 * State Displays
 * 
 * - To put values onto states and display them separately from the state turns
 * you can use the following script calls.
 * 
 *   battler.getStateDisplay(stateId)
 *   - This returns whatever value is stored for the specified battler under
 *     that specific state value.
 *   - If there is no value to be returned it will return an empty string.
 * 
 *   battler.setStateDisplay(stateId, value)
 *   - This sets the display for the battler's specific state to whatever you
 *     declared as the value.
 *   - The value is best used as a number or a string.
 * 
 *   battler.clearStateDisplay(stateId)
 *   - This clears the display for the battler's specific state.
 *   - In short, this sets the stored display value to an empty string.
 * 
 * ---
 *
 * Window Functions Moved
 *
 * - Some functions found in RPG Maker MZ's default code for Window_StatusBase
 * and Window_SkillList are now moved to Window_Base to make the functions
 * available throughout all windows for usage.
 *
 * ---
 *
 * ============================================================================
 * Slip Damage Popup Clarification
 * ============================================================================
 * 
 * Slip Damage popups only show one popup for HP, MP, and TP each and it is the
 * grand total of all the states and effects combined regardless of the number
 * of states and effects on a battler. This is how it is in vanilla RPG Maker
 * MZ and this is how we intend for it to be with the VisuStella MZ library.
 * 
 * This is NOT a bug!
 * 
 * The reason we are not changing this is because it does not properly relay
 * information to the player accurately. When multiple popups appear, players
 * only have roughly a second and a half to calculate it all for any form of
 * information takeaway. We feel it is better suited for the player's overall
 * convenience to show a cummulative change and steer the experience towards a
 * more positive one.
 *
 * ============================================================================
 * Passive State Clarification
 * ============================================================================
 * 
 * This section will explain various misconceptions regarding passive states.
 * No, passive states do not work the same way as states code-wise. Yes, they
 * use the same effects as states mechanically, but there are differences.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * === General Skill Notetags ===
 *
 * The following are general notetags that are skill-related.
 *
 * ---
 *
 * <Skill Type: x>
 * <Skill Types: x,x,x>
 *
 * <Skill Type: name>
 * <Skill Types: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Marks the skill to have multiple Skill Types, meaning they would appear
 *   under different skill types without needing to create duplicate skills.
 * - Replace 'x' with a number value representing the Skill Type's ID.
 * - If using 'name' notetag variant, replace 'name' with the Skill Type(s)
 *   name desired to be added.
 *
 * ---
 * 
 * <List Name: name>
 * 
 * - Used for: Skill Notetags
 * - Makes the name of the skill appear different when show in the skill list.
 * - Using \V[x] as a part of the name will display that variable.
 * 
 * ---
 * 
 * <ID Sort Priority: x>
 * 
 * - Used for: Skill Notetags
 * - Used for Scene_Skill.
 * - Changes sorting priority by ID for skills to 'x'. 
 *   - Default priority level is '50'.
 * - Skills with higher priority values will be sorted higher up on the list
 *   while lower values will be lower on the list.
 * 
 * ---
 *
 * === Skill Cost Notetags ===
 *
 * The following are notetags that can be used to adjust skill costs. Some of
 * these notetags are added through the Plugin Parameter: Skill Cost Types and
 * can be altered there. This also means that some of these notetags can have
 * their functionality altered and/or removed.
 *
 * ---
 *
 * <type Cost: x>
 * <type Cost: x%>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to designate costs of custom or already existing
 *   types that cannot be made by the Database Editor.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the exact type cost value.
 *   This lets you bypass the Database Editor's limit of 9,999 MP and 100 TP.
 * - The 'x%' version is replaced with a percentile value to determine a cost
 *   equal to a % of the type's maximum quantity limit.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: 500>
 *   <MP Cost: 25%>
 *   <Gold Cost: 3000>
 *   <Potion Cost: 5>
 *
 * ---
 *
 * <type Cost Max: x>
 * <type Cost Min: x>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to ensure conditional and % costs don't become too
 *   large or too small.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the maximum or minimum values
 *   that the cost can be.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost Max: 1500>
 *   <MP Cost Min: 5>
 *   <Gold Cost Max: 10000>
 *   <Potion Cost Min: 3>
 *
 * ---
 *
 * <type Cost: +x>
 * <type Cost: -x>
 *
 * <type Cost: x%>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will raise/lower the cost of any skill that uses the
 *   'type' cost by a specified amount.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - For % notetag variant: Replace 'x' with a number value to determine the
 *   rate to adjust the Skill Cost Type by as a rate value. This is applied
 *   before <type Cost: +x> and <type Cost: -x> notetags.
 * - For + and - notetag variants: Replace 'x' with a number value to determine
 *   how much to adjust the Skill Cost Type by as a flat value. This is applied
 *   after <type Cost: x%> notetags.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: +20>
 *   <MP Cost: -10>
 *   <Gold Cost: 50%>
 *   <Potion Cost: 200%>
 *
 * ---
 *
 * <Custom Cost Text>
 *  text
 * </Custom Cost Text>
 *
 * - Used for: Skill Notetags
 * - Allows you to insert custom text into the skill's cost area towards the
 *   end of the costs.
 * - Replace 'text' with the text you wish to display.
 * - Text codes may be used.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Costs ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine any dynamic Skill Cost Types used for particular skills.
 *
 * ---
 *
 * <JS type Cost>
 *  code
 *  code
 *  cost = code;
 * </JS type Cost>
 *
 * - Used for: Skill Notetags
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'code' to determine the type 'cost' of the skill.
 * - Insert the final type cost into the 'cost' variable.
 * - The 'user' variable refers to the user about to perform the skill.
 * - The 'skill' variable refers to the skill being used.
 * - Functionality for the notetag can be altered in the Plugin Parameters.
 *
 * ---
 *
 * === Gauge Replacement Notetags ===
 *
 * Certain classes can have their gauges swapped out for other Skill Cost
 * Types. This is especially helpful for the classes that don't utilize those
 * Skill Cost Types. You can mix and match them however you want.
 *
 * ---
 *
 * <Replace HP Gauge: type>
 * <Replace MP Gauge: type>
 * <Replace TP Gauge: type>
 *
 * - Used for: Class Notetags
 * - Replaces the HP (1st), MP (2nd), or TP (3rd) gauge with a different Skill
 *   Cost Type.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 *   - Does not work with 'Item Cost', 'Weapon Cost', or 'Armor Cost'.
 * - Replace 'type' with 'none' to not display any gauges there.
 * - The <Replace TP Gauge: type> will require 'Display TP in Window' setting
 *   to be on in the Database > System 1 tab.
 * - Functionality for the notetags can be altered by changes made to the
 *   Skill & States Core Plugin Parameters.
 *
 * ---
 * 
 * === Item Cost-Related Notetags ===
 * 
 * ---
 * 
 * <Item Cost: x name>
 * <Weapon Cost: x name>
 * <Armor Cost: x name>
 * 
 * - Used for: Skill Notetags
 * - The skill will consume items, weapons, and/or armors in order to be used.
 *   - Even non-consumable items will be consumed.
 * - Replace 'x' with a number representing the respective item cost.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * - Insert multiples of this notetag to consume multiple items, weapons,
 *   and/or armors.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 * 
 * Examples:
 * 
 *   <Item Cost: 5 Magic Water>
 *   <Item Cost: 2 Antidote>
 *   <Weapon Cost: 1 Short Sword>
 *   <Armor Cost: 3 Cloth Armor>
 * 
 * ---
 *
 * <Item Cost Max: x name>
 * <Item Cost Min: x name>
 *
 * <Weapon Cost Max: x name>
 * <Weapon Cost Min: x name>
 *
 * <Armor Cost Max: x name>
 * <Armor Cost Min: x name>
 * 
 * - Used for: Skill Notetags
 * - Sets up a maximum/minimum cost for the item, weapon, armor type costs.
 * - Replace 'x' with a number representing the maximum or minimum cost.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * 
 * Examples:
 * 
 *   <Item Cost Max: 10 Magic Water>
 *   <Item Cost Min: 2 Antidote>
 *   <Weapon Cost Max: 3 Short Sword>
 *   <Armor Cost Min: 1 Cloth Armor>
 * 
 * ---
 *
 * <Item Cost: +x name>
 * <Item Cost: -x name>
 *
 * <Weapon Cost: +x name>
 * <Weapon Cost: -x name>
 *
 * <Armor Cost: +x name>
 * <Armor Cost: -x name>
 * 
 * <Item Cost: x% name>
 * <Weapon Cost: x% name>
 * <Armor Cost: x% name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will raise/lower the item, weapon, and/or armor costs of
 *   any skill that costs those items, weapons, and/or armors by x%.
 * - For % notetag variant: Replace 'x' with a number value to determine the
 *   rate to adjust the Skill Cost Type by as a rate value. This is applied
 *   before <type Cost: +x> and <type Cost: -x> notetags.
 * - For + and - notetag variants: Replace 'x' with a number value to determine
 *   how much to adjust the Skill Cost Type by as a flat value. This is applied
 *   after <type Cost: x%> notetags.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * - Insert multiples of this notetag to consume multiple items, weapons,
 *   and/or armors.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 * 
 * Examples:
 * 
 *   <Item Cost: +1 Magic Water>
 *   <Item Cost: -2 Antidote>
 *   <Weapon Cost: 50% Short Sword>
 *   <Armor Cost: 200% Cloth Armor>
 * 
 * ---
 * 
 * <Replace Item name1 Cost: name2>
 * <Replace Weapon name1 Cost: name2>
 * <Replace Armor name1 Cost: name2>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will not consume 'name1' items, weapons, or armors.
 *   Instead, the cost will be redirected to 'name2' items, weapons, or armors.
 *   - Even non-consumable items will be consumed.
 * - Replace 'name1' with text representing the respective item, weapon, or
 *   armor that is the original cost type.
 * - Replace 'name2' with text representing the respective item, weapon, or
 *   armor that will be consumed instead.
 * 
 * Examples:
 * 
 *   <Replace Item Magic Water Cost: Potion>
 *   <Replace Item Antidote Cost: Dispel Herb>
 *   <Replace Weapon Short Sword Cost: Falchion>
 *   <Replace Armor Cloth Armor Cost: Leather Armor>
 * 
 * ---
 *
 * === Skill Accessibility Notetags ===
 *
 * Sometimes, you don't want all skills to be visible whether it be to hide
 * menu-only skills during battle, until certain switches are turned ON/OFF, or
 * until certain skills have been learned.
 *
 * ---
 *
 * <Hide in Battle>
 * <Hide outside Battle>
 *
 * - Used for: Skill Notetags
 * - Makes the specific skill visible or hidden depending on whether or not the
 *   player is currently in battle.
 *
 * ---
 *
 * <Show Switch: x>
 *
 * <Show All Switches: x,x,x>
 * <Show Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be hidden until all switches
 *   are ON. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the
 *   switches are ON. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide Switch: x>
 *
 * <Hide All Switches: x,x,x>
 * <Hide Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be shown until all switches
 *   are ON. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   switches are ON. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if learned Skill: x>
 *
 * <Show if learned All Skills: x,x,x>
 * <Show if learned Any Skills: x,x,x>
 *
 * <Show if learned Skill: name>
 *
 * <Show if learned All Skills: name, name, name>
 * <Show if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if learned Skill: x>
 *
 * <Hide if learned All Skills: x,x,x>
 * <Hide if learned Any Skills: x,x,x>
 *
 * <Hide if learned Skill: name>
 *
 * <Hide if learned All Skills: name, name, name>
 * <Hide if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if has Skill: x>
 *
 * <Show if have All Skills: x,x,x>
 * <Show if have Any Skills: x,x,x>
 *
 * <Show if has Skill: name>
 *
 * <Show if have All Skills: name, name, name>
 * <Show if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if has Skill: x>
 *
 * <Hide if have All Skills: x,x,x>
 * <Hide if have Any Skills: x,x,x>
 *
 * <Hide if has Skill: name>
 *
 * <Hide if have All Skills: name, name, name>
 * <Hide if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Enable Switch: x>
 *
 * <Enable All Switches: x,x,x>
 * <Enable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be disabled until all
 *   switches are ON. Then, it would be enabled.
 * - If 'Any' notetag variant is used, skill will be enabled if any of the
 *   switches are ON. Otherwise, it would be disabled.
 *
 * ---
 *
 * <Disable Switch: x>
 *
 * <Disable All Switches: x,x,x>
 * <Disable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be enabled until all switches
 *   are ON. Then, it would be disabled.
 * - If 'Any' notetag variant is used, skill will be disabled if any of the
 *   switches are ON. Otherwise, it would be enabled.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Accessibility ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine if a skill can be accessible visibly or through usage.
 *
 * ---
 *
 * <JS Skill Visible>
 *  code
 *  code
 *  visible = code;
 * </JS Skill Visible>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on JavaScript code.
 * - Replace 'code' to determine the type visibility of the skill.
 * - The 'visible' variable returns a boolean (true/false) to determine if the
 *   skill will be visible or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other visibility conditions must be met for this code to count.
 *
 * ---
 *
 * <JS Skill Enable>
 *  code
 *  code
 *  enabled = code;
 * </JS Skill Enable>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on JavaScript code.
 * - Replace 'code' to determine the type enabled status of the skill.
 * - The 'enabled' variable returns a boolean (true/false) to determine if the
 *   skill will be enabled or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other skill conditions must be met in order for this to code to count.
 *
 * ---
 *
 * === General State-Related Notetags ===
 *
 * The following notetags are centered around states, such as how their turn
 * counts are displayed, items and skills that affect state turns, if the state
 * can avoid removal by death state, etc.
 *
 * ---
 *
 * <No Death Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon death.
 * - This allows this state to be added to an already dead battler, too.
 *
 * ---
 *
 * <No Recover All Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon using the Recover All command.
 *
 * ---
 *
 * <Group Defeat>
 *
 * - Used for: State Notetags
 * - If an entire party is affected by states with the <Group Defeat> notetag,
 *   they are considered defeated.
 * - Usage for this includes party-wide petrification, frozen, etc.
 *
 * ---
 *
 * <Reapply Rules: Ignore>
 * <Reapply Rules: Reset>
 * <Reapply Rules: Greater>
 * <Reapply Rules: Add>
 *
 * - Used for: State Notetags
 * - Choose what kind of rules this state follows if the state is being applied
 *   to a target that already has the state. This affects turns specifically.
 * - 'Ignore' will bypass any turn changes.
 * - 'Reset' will recalculate the state's turns.
 * - 'Greater' will choose to either keep the current turn count if it's higher
 *   than the reset amount or reset it if the current turn count is lower.
 * - 'Add' will add the state's turn count to the applied amount.
 * - If this notetag isn't used, it will use the rules set in the States >
 *   Plugin Parameters.
 *
 * ---
 *
 * <Positive State>
 * <Negative State>
 *
 * - Used for: State Notetags
 * - Marks the state as a positive state or negative state, also altering the
 *   state's turn count color to match the Plugin Parameter settings.
 * - This also puts the state into either the 'Positive' category or
 *   'Negative' category.
 *
 * ---
 *
 * <Category: name>
 * <Category: name, name, name>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace 'name' with a category name to mark this state as.
 * - Insert multiples of this to mark the state with  multiple categories.
 *
 * ---
 *
 * <Categories>
 *  name
 *  name
 * </Categories>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace each 'name' with a category name to mark this state as.
 *
 * ---
 * 
 * <Bypass State Damage Removal: id>
 * <Bypass State Damage Removal: id, id, id>
 * 
 * <Bypass State Damage Removal: name>
 * <Bypass State Damage Removal: name, name, name>
 * 
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used to attack an enemy with the listed state that
 *   would normally have on damage removal (ie Sleep).
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for attacks like "Dream Eater" that would prevent waking
 *   up a sleeping opponent.
 * 
 * ---
 * 
 * <Bypass State Damage Removal as Attacker: id>
 * <Bypass State Damage Removal as Attacker: id, id, id>
 * 
 * <Bypass State Damage Removal as Attacker: name>
 * <Bypass State Damage Removal as Attacker: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - When an attacker with an associated trait object that has this notetag
 *   would attack an enemy with the listed state, bypass on damage removal.
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for effects like "Sleep Striker" that would prevent the
 *   attacker from waking up a sleeping opponent.
 * 
 * ---
 * 
 * <Bypass State Damage Removal as Target: id>
 * <Bypass State Damage Removal as Target: id, id, id>
 * 
 * <Bypass State Damage Removal as Target: name>
 * <Bypass State Damage Removal as Target: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - When a target with an associated trait object that has this notetag is
 *   attacked as the target with the listed state, bypass on damage removal.
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for effects like "Deep Sleep" that would prevent the
 *   attacked target from waking up.
 * 
 * ---
 * 
 * <Resist State Category: name>
 * <Resist State Categories: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Causes the affected battler resist the listed categories.
 * - Replace each 'name' with a category name to resist.
 *   - Insert multiple 'name' entries to add more categories.
 * - This works exactly like how state resistances work in-game. If a battler
 *   who was originally NOT resistant to "Poison" before gaining a
 *   poison-resistant trait, the "Poison" state will remain because it was
 *   applied before poison-resistance as enabled.
 * 
 * ---
 * 
 * <Resist State Categories>
 *  name
 *  name
 *  name
 * </Resist State Categories>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Causes the affected battler resist the listed categories.
 * - Replace each 'name' with a category name to resist.
 *   - Insert multiple 'name' entries to add more categories.
 * - This works exactly like how state resistances work in-game. If a battler
 *   who was originally NOT resistant to "Poison" before gaining a
 *   poison-resistant trait, the "Poison" state will remain because it was
 *   applied before poison-resistance as enabled.
 * 
 * ---
 *
 * <State x Category Remove: y>
 * 
 * <State x Category Remove: All>
 *
 * - Used for: Skill, Item Notetags
 * - Allows the skill/item to remove 'y' states from specific category 'x'.
 * - Replace 'x' with a category name to remove from.
 * - Replace 'y' with the number of times to remove from that category.
 * - Use the 'All' variant to remove all of the states of that category.
 * - Insert multiples of this to remove different types of categories.
 *
 * ---
 * 
 * <Remove Other x States>
 * 
 * - Used for: State Notetags
 * - When the state with this notetag is added, remove other 'x' category
 *   states from the battler (except for the state being added).
 * - Replace 'x' with a category name to remove from.
 * - Insert multiples of this to remove different types of categories.
 * - Useful for thing state types like stances and forms that there is usually
 *   only one active at a time.
 * 
 * ---
 *
 * <Hide State Turns>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - This will by pass any Plugin Parameter settings.
 *
 * ---
 *
 * <Turn Color: x>
 * <Turn Color: #rrggbb>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - Determines the color of the state's turn count.
 * - Replace 'x' with a number value depicting a window text color.
 * - Replace 'rrggbb' with a hex color code for a more custom color.
 *
 * ---
 * 
 * <Max Turns: x>
 * 
 * - Used for: State Notetags
 * - Determines the upper limit on the maximum number of turns for this state.
 * - Replace 'x' with a number representing the maximum number of turns used
 *   for this state.
 * - If no notetag is used, refer to the default setting found in the Plugin
 *   Parameters under "State Settings".
 * 
 * ---
 *
 * <State id Turns: +x>
 * <State id Turns: -x>
 *
 * <Set State id Turns: x>
 *
 * <State name Turns: +x>
 * <State name Turns: -x>
 *
 * <Set State name Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by state 'id' or state 'name', change the state
 *   turn duration for target.
 * - For 'id' variant, replace 'id' with the ID of the state to modify.
 * - For 'name' variant, replace 'name' with the name of the state to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple states at once.
 *
 * ---
 *
 * <param Buff Turns: +x>
 * <param Buff Turns: -x>
 *
 * <Set param Buff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' buff, change that buff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter buff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * <param Debuff Turns: +x>
 * <param Debuff Turns: -x>
 *
 * <Set param Debuff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' debuff, change that debuff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter debuff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * === JavaScript Notetags: On Add/Erase/Expire ===
 *
 * Using JavaScript code, you can use create custom effects that occur when a
 * state has bee added, erased, or expired.
 * 
 * ---
 *
 * <JS On Add State>
 *  code
 *  code
 * </JS On Add State>
 *
 * - Used for: State Notetags
 * - When a state is added, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Erase State>
 *  code
 *  code
 * </JS On Erase State>
 *
 * - Used for: State Notetags
 * - When a state is erased, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Expire State>
 *  code
 *  code
 * </JS On Expire State>
 *
 * - Used for: State Notetags
 * - When a state has expired, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * === JavaScript Notetags: Slip Damage/Healing ===
 *
 * Slip Damage, in RPG Maker vocabulary, refers to damage over time. The
 * following notetags allow you to perform custom slip damage/healing.
 *
 * ---
 *
 * <JS type Slip Damage>
 *  code
 *  code
 *  damage = code;
 * </JS type Slip Damage>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip damage is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip damage.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the damage.
 * - The 'state' variable refers to the current state being affected.
 * - The 'damage' variable is the finalized slip damage to be dealt.
 * - When these states are applied via action effects, the slip calculations
 *   are one time calculations made upon applying and the damage is cached to
 *   be used for future on regeneration calculations.
 * - For that reason, do not include game mechanics here such as adding states,
 *   buffs, debuffs, etc. as this notetag is meant for calculations only. Use
 *   the VisuStella Battle Core's <JS Pre-Regenerate> and <JS Post-Regenerate>
 *   notetags for game mechanics instead.
 * - Passive states and states with the <JS Slip Refresh> notetag are exempt
 *   from the one time calculation and recalculated each regeneration phase.
 *
 * ---
 *
 * <JS type Slip Heal>
 *  code
 *  code
 *  heal = code;
 * </JS type Slip Heal>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip healing is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip healing.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the healing.
 * - The 'state' variable refers to the current state being affected.
 * - The 'heal' variable is the finalized slip healing to be recovered.
 * - When these states are applied via action effects, the slip calculations
 *   are one time calculations made upon applying and the damage is cached to
 *   be used for future on regeneration calculations.
 * - For that reason, do not include game mechanics here such as adding states,
 *   buffs, debuffs, etc. as this notetag is meant for calculations only. Use
 *   the VisuStella Battle Core's <JS Pre-Regenerate> and <JS Post-Regenerate>
 *   notetags for game mechanics instead.
 * - Passive states and states with the <JS Slip Refresh> notetag are exempt
 *   from the one time calculation and recalculated each regeneration phase.
 *
 * ---
 * 
 * <JS Slip Refresh>
 * 
 * - Used for: State Notetags
 * - Refreshes the calculations made for the JS Slip Damage/Heal amounts at the
 *   start of each regeneration phase to allow for dynamic damage ranges.
 * 
 * ---
 *
 * === Passive State Notetags ===
 *
 * Passive States are states that are always applied to actors and enemies
 * provided that their conditions have been met. These can be granted through
 * database objects or through the Passive States Plugin Parameters.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * <Passive State: x>
 * <Passive States: x,x,x>
 *
 * <Passive State: name>
 * <Passive States: name, name, name>
 *
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Adds passive state(s) x to trait object, applying it to related actor or
 *   enemy unit(s).
 * - Replace 'x' with a number to determine which state to add as a passive.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive.
 * - Note: If you plan on applying a passive state through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 *
 * ---
 *
 * <Passive Stackable>
 *
 * - Used for: State Notetags
 * - Makes it possible for this passive state to be added multiple times.
 * - Otherwise, only one instance of the passive state can be available.
 *
 * ---
 *
 * <Passive Condition Class: id>
 * <Passive Condition Classes: id, id, id>
 *
 * <Passive Condition Class: name>
 * <Passive Condition Classes: name, name, name>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on the actor's
 *   current class. As long as the actor's current class matches one of the
 *   data entries, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Multiclass: id>
 * <Passive Condition Multiclass: id, id, id>
 *
 * <Passive Condition Multiclass: name>
 * <Passive Condition Multiclass: name, name, name>
 *
 * - Used for: State Notetags
 * - Requires VisuMZ_2_ClassChangeSystem!
 * - Determines the passive condition of the passive state based on the actor's
 *   multiclasses. As long as the actor has any of the matching classes
 *   assigned as a multiclass, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Switch ON: x>
 *
 * <Passive Condition All Switches ON: x,x,x>
 * <Passive Condition Any Switch ON: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are ON. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are ON. Otherwise, it would not be met.
 *
 * ---
 *
 * <Passive Condition Switch OFF: x>
 *
 * <Passive Condition All Switches OFF: x,x,x>
 * <Passive Condition Any Switch OFF: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are OFF. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are OFF. Otherwise, it would not be met.
 *
 * ---
 *
 * === JavaScript Notetags: Passive State ===
 *
 * The following is a notetag made for users with JavaScript knowledge to
 * determine if a passive state's condition can be met.
 *
 * ---
 *
 * <JS Passive Condition>
 *  code
 *  code
 *  condition = code;
 * </JS Passive Condition>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the state based on JavaScript code.
 * - Replace 'code' to determine if a passive state's condition has been met.
 * - The 'condition' variable returns a boolean (true/false) to determine if
 *   the passive state's condition is met or not.
 * - The 'user' variable refers to the user affected by the passive state.
 * - The 'state' variable refers to the passive state being checked.
 * - All other passive conditions must be met for this code to count.
 * 
 * **NOTE** Not everything can be used as a custom JS Passive Condition due to
 * limitations of the code. There are failsafe checks to prevent infinite loops
 * and some passive conditions will not register for this reason and the
 * conditional checks will behave as if the passive states have NOT been
 * applied for this reason. Such examples include the following:
 * 
 * - A passive state that requires another passive state
 * - A passive state that requires a trait effect from another state
 * - A passive state that requires a parameter value altered by another state
 * - A passive state that requires equipment to be worn but its equipment type
 *   access is provided by another state.
 * - Anything else that is similar in style.
 *
 * ---
 * 
 * === Skill Toggle Notetags ===
 * 
 * Skill Toggles are skills that can be toggled ON or OFF. If ON, then any
 * passive states on that skill will become enabled (assuming all other passive
 * conditions are met) and if toggled OFF, then that passive state will not
 * appear (even if all other conditions are met).
 * 
 * Skill Toggles do not take up actions, even in battle. They will not consume
 * an actor's current turn. A player can toggle multiple skill toggles at a
 * time.
 * 
 * Skill Toggles require the character to pay the skill cost ONLY when the
 * skill is toggled from OFF to ON, not when it is toggled ON to OFF.
 * 
 * Enemies are unable to switch Toggle Skills and the passive effects on a
 * Toggle Skill for an enemy will always be considered ON.
 * 
 * Otherwise, you can use JavaScript calls like the following for script call
 * checks, and the like:
 * 
 *   $gameActors.actor(2).isSkillToggled($dataSkills[3])
 * 
 * ---
 * 
 * <Toggle>
 * 
 * - Used for: Skill Notetags
 * - Turns the skill into a toggle skill.
 * - Best used with a passive state.
 * - Toggle skills cannot be used with certain skill effects:
 *   - Active Chain Skills, Evolution Matrix Skills, Input Combo Skills
 *   - Field Skills
 *   - Item Amplify Skills, Item Concoct Skills, Item Throw Skills
 *   - Toggle skills cannot be Skill Containers
 * 
 * ---
 * 
 * <Initial Toggle: On>
 * <Initial Toggle: Off>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - Sets the initial toggle for this skill to be ON/OFF.
 *   - aka when an actor learns the skill for the first time and this
 *     determines what toggle it will have
 * - If this notetag is not used, refer to the setting found in the
 *   Plugin Parameters
 * 
 * ---
 * 
 * <Toggle Exclusion Group: key>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When this skill is toggled, all other toggle skills with a matching 'key'
 *   will be turned off.
 *   - For example, the skills Fire Force, Ice Force, and Thunder Force have
 *     the <Toggle Exclusion Group: Force> notetag.
 *   - When Fire Force is toggled ON, then Ice Force and Thunder Force will
 *     automatically turn OFF.
 * - Replace 'key' with a toggle exclusion group name for this skill to use.
 * 
 * ---
 * 
 * <Toggle On Animation: x>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When a skill is turned off, this is the animation that plays.
 * - If this notetag is not used, refer to the skill's animation.
 * - Replace 'x' with a number representing the ID of the animation to play
 *   when the skill is toggled on.
 * 
 * ---
 * 
 * <Toggle Off Animation: x>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When a skill is turned off, this is the animation that plays.
 * - If this notetag is not used, refer to the Plugin Parameters' animation.
 * - Replace 'x' with a number representing the ID of the animation to play
 *   when the skill is toggled off.
 * 
 * ---
 * 
 * === Aura & Miasma Notetags ===
 * 
 * Auras are a type passive that affects an allied party. Miasmas are a type of
 * passive that affects an opposing party. Auras and Miasmas only need to come
 * from a single source to give an entire party or troop a passive provided
 * that the battler emitting the aura/miasma is alive and in battle.
 * 
 * ---
 * 
 * <Aura State: x>
 * <Aura States: x, x, x>
 * 
 * <Aura State: name>
 * <Aura States: name, name, name>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Emits an aura that affects the battler's allies and gives each affected
 *   member passive state(s) 'x'.
 * - Replace 'x' with a number to determine which state to add as a passive
 *   generated by this aura.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive generated by this aura.
 * - Note: If you plan on applying an aura effect through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 * 
 * ---
 * 
 * <Miasma State: x>
 * <Miasma States: x, x, x>
 * 
 * <Miasma State: name>
 * <Miasma States: name, name, name>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Emits an miasma that affects the battler's opponents and gives each
 *   affected member passive state(s) 'x'.
 * - Miasmas do NOT apply outside of battle.
 * - Replace 'x' with a number to determine which state to add as a passive
 *   generated by this miasma.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive generated by this miasma.
 * - Note: If you plan on applying a miasma effect through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 * 
 * ---
 * 
 * <Not User Aura>
 * <Aura Not For User>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Prevents the emitting user from being affected by the related aura.
 * 
 * ---
 * 
 * <Allow Dead Aura>
 * <Allow Dead Miasma>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Allows aura/miasma to continue emitting even after the emitting user is
 *   in a dead state.
 * - When used with Actor, Class, Skill, Weapon, Armor, Enemy objects, it will
 *   only affect the auras/miasmas emitted from that object.
 * - When used with States, the effect will take place as long as it is used
 *   as an aura or miasma regardless of where it is emitting from.
 * - Takes priority over <Dead Aura Only> and <Dead Miasma Only> notetags.
 * 
 * ---
 * 
 * <Dead Aura Only>
 * <Dead Miasma Only>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Allows aura/miasma to only emit if the emitting user is in a dead state.
 * - When used with Actor, Class, Skill, Weapon, Armor, Enemy objects, it will
 *   only affect the auras/miasmas emitted from that object.
 * - When used with States, the effect will take place as long as it is used
 *   as an aura or miasma regardless of where it is emitting from.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Skill Cost Plugin Commands ===
 * 
 * ---
 * 
 * Skill Cost: Emulate Actor Pay
 * - Target actor(s) emulates paying for skill cost.
 * - 
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) will pay skill cost.
 * 
 *   Skill ID:
 *   - What is the ID of the skill to emulate paying the skill cost for?
 * 
 * ---
 * 
 * Skill Cost: Emulate Enemy Pay
 * - Target enemy(s) emulates paying for skill cost.
 * - 
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) will pay skill cost.
 * 
 *   Skill ID:
 *   - What is the ID of the skill to emulate paying the skill cost for?
 * 
 * ---
 * 
 * === State Turns Plugin Commands ===
 * 
 * ---
 * 
 * State Turns: Actor State Turns Change By
 * - Changes actor(s) state turns by an amount.
 * - Only works on states that can have turns.
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns By:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Actor State Turns Change To
 * - Changes actor(s) state turns to a specific value.
 * - Only works on states that can have turns.
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns To:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Enemy State Turns Change By
 * - Changes enemy(s) state turns by an amount.
 * - Only works on states that can have turns.
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns By:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Enemy State Turns Change To
 * - Changes enemy(s) state turns to a specific value.
 * - Only works on states that can have turns.
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns To:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 *
 * ============================================================================
 * Plugin Parameters: General Skill Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust various aspects of the game regarding skills
 * from the custom Skill Menu Layout to global custom effects made in code.
 *
 * ---
 *
 * General
 * 
 *   Use Updated Layout:
 *   - Use the Updated Skill Menu Layout provided by this plugin?
 *   - This will automatically enable the Status Window.
 *   - This will override the Core Engine windows settings.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 *
 * ---
 *
 * Skill Type Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Skill Type Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Skill Type Window.
 * 
 *   Window Width:
 *   - What is the desired pixel width of this window?
 *   - Default: 240
 *
 * ---
 *
 * List Window
 * 
 *   Columns:
 *   - Number of maximum columns.
 *
 * ---
 *
 * Shop Status Window
 * 
 *   Show in Skill Menu?:
 *   - Show the Shop Status Window in the Skill Menu?
 *   - This is enabled if the Updated Layout is on.
 * 
 *   Adjust List Window?:
 *   - Automatically adjust the Skill List Window in the Skill Menu if using
 *     the Shop Status Window?
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this Shop Status Window in the
 *     Skill Menu.
 *
 * ---
 *
 * Skill Types
 * 
 *   Hidden Skill Types:
 *   - Insert the ID's of the Skill Types you want hidden from view ingame.
 * 
 *   Hidden During Battle:
 *   - Insert the ID's of the Skill Types you want hidden during battle only.
 * 
 *   Icon: Normal Type:
 *   - Icon used for normal skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 * 
 *   Icon: Magic Type:
 *   - Icon used for magic skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 * 
 *   Sort: Alphabetical:
 *   - Insert the ID's of Skill Types you want sorted alphabetically.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Skill Conditions:
 *   - JavaScript code for a global-wide skill condition check.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Cost Types
 * ============================================================================
 *
 * Skill Cost Types are the resources that are used for your skills. These can
 * range from the default MP and TP resources to the newly added HP, Gold, and
 * Potion resources.
 *
 * ---
 *
 * Settings
 * 
 *   Name:
 *   - A name for this Skill Cost Type.
 * 
 *   Icon:
 *   - Icon used for this Skill Cost Type.
 *   - Use 0 for no icon.
 * 
 *   Font Color:
 *   - Text Color used to display this cost.
 *   - For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * 
 *   Font Size:
 *   - Font size used to display this cost.
 *
 * ---
 *
 * Cost Processing
 * 
 *   JS: Cost Calculation:
 *   - Code on how to calculate this resource cost for the skill.
 * 
 *   JS: Can Pay Cost?:
 *   - Code on calculating whether or not the user is able to pay the cost.
 * 
 *   JS: Paying Cost:
 *   - Code for if met, this is the actual process of paying of the cost.
 *
 * ---
 *
 * Window Display
 * 
 *   JS: Show Cost?:
 *   - Code for determining if the cost is shown or not.
 * 
 *   JS: Cost Text:
 *   - Code to determine the text (with Text Code support) used for the
 *     displayed cost.
 *
 * ---
 *
 * Gauge Display
 * 
 *   JS: Maximum Value:
 *   - Code to determine the maximum value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Current Value:
 *   - Code to determine the current value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Draw Gauge:
 *   - Code to determine how to draw the Skill Cost resource for this 
 *     gauge type.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Toggle Settings
 * ============================================================================
 *
 * Skill toggles are a new type of skill. They do not perform any actions but
 * instead, will switch on/off any passive effects the skill has.
 * 
 * Skill Toggles do not take up actions, even in battle. They will not consume
 * an actor's current turn. A player can toggle multiple skill toggles at a
 * time.
 * 
 * Skill Toggles require the character to pay the skill cost ONLY when the
 * skill is toggled from OFF to ON, not when it is toggled ON to OFF.
 * 
 * Enemies are unable to switch Toggle Skills and the passive effects on a
 * Toggle Skill for an enemy will always be considered ON.
 *
 * ---
 *
 * Default
 * 
 *   Default Toggle:
 *   - What is the default toggle setting for toggle skills?
 * 
 *   Toggle Off Animation:
 *   - Play this animation when a skill is toggled off.
 *   - Requires VisuMZ_0_CoreEngine.
 *   - Toggle On animation by default is whatever the skill animation is set to
 * 
 * ---
 * 
 * Appearance
 * 
 *   Toggle On Text Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *   - Applies for skill name, not the skill cost
 * 
 * ---
 * 
 * Vocabulary
 * 
 *   Toggle Type:
 *   - Skill toggle displayed in the status window.
 * 
 *   Toggle On:
 *   - Text displayed for a skill that's toggled on
 * 
 *   Toggle Off:
 *   - Text displayed for a skill that's toggled off
 * 
 *     Off Text Location:
 *     - Where is the [OFF] text located in the skill cost?
 *       - front
 *       - back
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gauge Settings
 * ============================================================================
 *
 * Settings in regards to how skill cost gauges function and appear.
 *
 * ---
 *
 * Labels
 * 
 *   Font Type:
 *   - Which font type should be used for labels?
 * 
 *   Match Label Color:
 *   - Match the label color to the Gauge Color being used?
 * 
 *     Match: Gauge # ?:
 *     - Which Gauge Color should be matched?
 * 
 *     Preset: Gauge Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *   Solid Outline:
 *   - Make the label outline a solid black color?
 * 
 *   Outline Width:
 *   - What width do you wish to use for your outline?
 *   - Use 0 to not use an outline.
 *
 * ---
 *
 * Values
 * 
 *   Font Type:
 *   - Which font type should be used for values?
 * 
 *   Solid Outline:
 *   - Make the value outline a solid black color?
 * 
 *   Outline Width:
 *   - What width do you wish to use for your outline?
 *   - Use 0 to not use an outline.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General State Settings
 * ============================================================================
 *
 * These are general settings regarding RPG Maker MZ's state-related aspects
 * from how turns are reapplied to custom code that's ran whenever states are
 * added, erased, or expired.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying states.
 *   - Ignore: State doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let states go up to.
 *   - This can be changed with the <Max Turns: x> notetag.
 * 
 *   Action End Update:
 *   - Refer to "Major Changes" in Help File for explanation.
 * 
 *   Turn End on Map:
 *   - Update any state and buff turns on the map after this many steps.
 *   - Use 0 to disable.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display state turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Turn Color: Neutral:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Positive:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Negative:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Data Display
 * 
 *   Show Data?:
 *   - Display state data on top of window icons and sprites?
 * 
 *   Data Font Size:
 *   - Font size used for displaying state data.
 * 
 *   Offset X:
 *   - Offset the X position of the state data display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the state data display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is added.
 * 
 *   JS: On Erase State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is erased.
 * 
 *   JS: On Expire State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     has expired.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Buff/Debuff Settings
 * ============================================================================
 *
 * Buffs and debuffs don't count as states by RPG Maker MZ's mechanics, but
 * they do function close enough for them to be added to this plugin for
 * adjusting. Change these settings to make buffs and debuffs work to your
 * game's needs.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying buffs/debuffs.
 *   - Ignore: Buff/Debuff doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let buffs and debuffs go up to.
 *
 * ---
 *
 * Stacking
 * 
 *   Max Stacks: Buff:
 *   - Maximum number of stacks for buffs.
 * 
 *   Max Stacks: Debuff:
 *   - Maximum number of stacks for debuffs.
 * 
 *   JS: Buff/Debuff Rate:
 *   - Code to determine how much buffs and debuffs affect parameters.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display buff and debuff turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Color: Buffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Debuffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Rate Display
 * 
 *   Show Rate?:
 *   - Display buff and debuff rate on top of window icons and sprites?
 * 
 *   Rate Font Size:
 *   - Font size used for displaying rate.
 * 
 *   Offset X:
 *   - Offset the X position of the rate display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the rate display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Add Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Erase Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Erase Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Expire Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Expire Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Passive State Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust passive states that can affect all actors and
 * enemies as well as have global conditions.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * List
 * 
 *   Global Passives:
 *   - A list of passive states to affect actors and enemies.
 * 
 *   Actor-Only Passives:
 *   - A list of passive states to affect actors only.
 * 
 *   Enemy Passives:
 *   - A list of passive states to affect enemies only.
 *
 * ---
 * 
 * Cache
 * 
 *   Switch Refresh?:
 *   - Refresh all battle members when switches are changed in battle?
 *   - This is primarily used for passive state conditions involve parameters
 *     that do not update due to cached data until a refresh occurs.
 *   - If this is on, do not spam Switch changes during battle in order to
 *     prevent lag spikes.
 * 
 *   Variable Refresh?:
 *   - Refresh all battle members when variables are changed in battle?
 *   - This is primarily used for passive state conditions involve parameters
 *     that do not update due to cached data until a refresh occurs.
 *   - If this is on, do not spam Variable changes during battle in order to
 *     prevent lag spikes.
 * 
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Condition Check:
 *   - JavaScript code for a global-wide passive condition check.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * - Yanfly
 * - Arisu
 * - Olivia
 * - Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.52: August 14, 2025
 * * Feature Update!
 * ** Passive States with custom JS conditions should be less prone to infinite
 *    loops. Update made by Irina.
 * 
 * Version 1.51: April 17, 2025
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Olivia:
 * *** Plugin Parameters > Skill Toggle Settings
 * **** Skill toggles are a new type of skill. They do not perform any actions
 *      but instead, will switch on/off any passive effects the skill has.
 * **** Enemies are unable to switch Toggle Skills and the passive effects on a
 *      Toggle Skill for an enemy will always be considered ON.
 * **** See the help file for more information.
 * ** New Notetags added by Olivia:
 * *** Skill Toggle Notetags:
 * **** <Toggle>
 * **** <Initial Toggle: On/Off>
 * **** <Toggle Exclusion Group: key>
 * **** <Toggle On Animation: x>
 * **** <Toggle Off Animation: x>
 * ***** See the help file for more information.
 * 
 * Version 1.50: March 20, 2025
 * * Documentation Update!
 * ** Changed the description of Plugin Parameter 'Action End Update' to
 *    'Refer to "Major Changes" in Help File for explanation.'
 * ** Added examples of "Action End Update" under "Major Changes"
 * *** The new state: "Fiery Blade" will allow the affected battler to deal
 *     fire elemental damage. With Action End, this means for 5 actions, those
 *     attacks will deal fire damage.
 * *** This means that if no action is taken, due to a status effect like
 *     "Sleep" or "Stun", then the duration count will not decrease.
 * *** On the flip side, if the battler performs multiple actions a turn, then
 *     the duration count drops faster because more actions have been spent.
 * *** However, if this "Fiery Blade" state was using Turn End instead, it will
 *     have its duration reduced by 1 each turn, regardless of "Sleep" or
 *     "Stun" states, and regardless of how many actions are performed each
 *     turn.
 * 
 * Version 1.49: February 20, 2025
 * * Bug Fixes!
 * ** Fixed a bug where causing a dead battler to refresh afterwards would
 *    yield multiple death states on that battler. Fix made by Arisu.
 * * Compatibility Update!
 * ** Updated for RPG Maker MZ Core Scripts 1.9.0!
 * *** Better compatibility with different icon sizes.
 * 
 * Version 1.48: December 19, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** Auras & Miasmas added by Olivia:
 * *** Auras are a type passive that affects an allied party. Miasmas are a
 *     type of passive that affects an opposing party. Auras and Miasmas only
 *     need to come from a single source to give an entire party or troop a
 *     passive provided that the battler emitting the aura/miasma is alive and
 *     in battle.
 * ** New Notetags added by Olivia:
 * *** <Aura State: x>
 * **** Emits an aura that affects the battler's allies and gives each affected
 *      member passive state(s) 'x'.
 * *** <Miasma State: x>
 * **** Emits an aura that affects the battler's opponents and gives each
 *      affected member passive state(s) 'x'.
 * *** <Not User Aura>
 * **** Prevents the emitting user from being affected by the related aura.
 * *** <Allow Dead Aura>
 * *** <Allow Dead Miasma>
 * **** Allows aura/miasma to continue emitting even after the emitting user is
 *      in a dead state.
 * *** <Dead Aura Only>
 * *** <Dead Miasma Only>
 * **** Allows aura/miasma to only emit if the emitting user is in a dead state
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.47: August 29, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetags added by Arisu:
 * *** <Bypass State Damage Removal: id/name>
 * **** When this skill/item is used to attack an enemy with the listed state
 *      that would normally have on damage removal (ie Sleep).
 * **** This can be used for attacks like "Dream Eater" that would prevent
 *      waking up a sleeping opponent.
 * *** <Bypass State Damage Removal as Attacker: id/name>
 * **** When an attacker with an associated trait object that has this notetag
 *      would attack an enemy with the listed state, bypass on damage removal.
 * **** This can be used for effects like "Sleep Striker" that would prevent
 *      the attacker from waking up a sleeping opponent.
 * *** <Bypass State Damage Removal as Target: id/name>
 * **** When a target with an associated trait object that has this notetag is
 *      attacked as the target with the listed state, bypass on damage removal.
 * **** This can be used for effects like "Deep Sleep" that would prevent the
 *      attacked target from waking up.
 * 
 * Version 1.46: July 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Parameters > Skill Settings > Skill Types > Sort: Alphabetical
 * **** Insert the ID's of Skill Types you want sorted alphabetically.
 * ** New notetags added by Irina:
 * *** <ID Sort Priority: x>
 * **** Used for Scene_Skill.
 * **** Changes sorting priority by ID for skill to 'x'. 
 * **** Default priority level is '50'.
 * **** Skills with higher priority values will be sorted higher up on the list
 *      while lower values will be lower on the list.
 * 
 * Version 1.45: May 16, 2024
 * * Bug Fixes!
 * ** Fixed a problem with passive state conditional notetags not working
 *    properly. Fix made by Irina.
 * 
 * Version 1.44: April 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where passive states would not appear. Fix made by Olivia.
 * ** Fixed a bug where a crash would occur if certain plugins cleared the
 *    passive state cache midway through trying to register it. Fix by Olivia.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * ** States with lots and lots of text data within their notes will no longer
 *    cause FPS drops.
 * 
 * Version 1.43: January 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu!
 * *** Skill Cost: Emulate Actor Pay
 * *** Skill Cost: Emulate Enemy Pay
 * **** Target actor(s)/enemy(s) emulates paying for skill cost.
 * *** State Turns: Actor State Turns Change By
 * *** State Turns: Actor State Turns Change To
 * *** State Turns: Enemy State Turns Change By
 * *** State Turns: Enemy State Turns Change To
 * **** Changes actor(s)/enemy(s) state turns to a specific value/by an amount.
 * **** Only works on states that can have turns.
 * 
 * Version 1.42: November 16, 2023
 * * Bug Fixes!
 * ** 'origin' variable was not working properly for <JS On Expire State>
 *    JavaScript notetag. Should now be working properly. Fix made by Irina.
 * 
 * Version 1.41: September 14, 2023
 * * Bug Fixes!
 * ** Fixed a bug that prevented <Max Turns: x> for states from working due to
 *    one of the recent updates. Fix made by Arisu.
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Apparently, we never put <Max Turns: x> in the help notetag section.
 *    Woops... It's there now.
 * 
 * Version 1.40: August 17, 2023
 * * Bug Fixes!
 * ** Fixed a bug involving the "Item Cost" skill cost type found in the Plugin
 *    Parameters when involving consumable items.
 * *** If you want to acquire these settings for an already-existing project,
 *     do either of the following:
 * **** Delete the existing VisuMZ_1_SkillsStatesCore.js in the Plugin Manager
 *      list and install the newest version.
 * **** Or create a new project, install VisuMZ_1_SkillsStatesCore.js there,
 *      then copy over the "Item Cost" plugin parameters found in the "Skill
 *      Cost Types" plugin parameter settings to your current project.
 * 
 * Version 1.39: July 13, 2023
 * * Feature Update!
 * ** Updated the "Item Cost" skill cost type found in the Plugin Parameters to
 *    no longer consume items that are key items or nonconsumable.
 * *** If you want to acquire these settings for an already-existing project,
 *     do either of the following:
 * **** Delete the existing VisuMZ_1_SkillsStatesCore.js in the Plugin Manager
 *      list and install the newest version.
 * **** Or create a new project, install VisuMZ_1_SkillsStatesCore.js there,
 *      then copy over the "Item Cost" plugin parameters found in the "Skill
 *      Cost Types" plugin parameter settings to your current project.
 * 
 * Version 1.38: March 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added segment to <Replace x Gauge: type> in documentation:
 * *** Does not work with 'Item Cost', 'Weapon Cost', or 'Armor Cost'.
 * * New Features!
 * ** New "Skill Cost Type" and notetags added by Arisu and sponsored by FAQ.
 * *** <Item Cost: x name>
 * *** <Weapon Cost: x name>
 * *** <Armor Cost: x name>
 * **** The skill will consume items, weapons, and/or armors in order to be
 *      used. Even non-consumable items will be consumed.
 * *** <Item Cost Max/Min: x name>
 * *** <Weapon Cost Max/Min: x name>
 * *** <Armor Cost Max/Min: x name>
 * **** Sets up a maximum/minimum cost for the item, weapon, armor type costs.
 * *** <Item Cost: x% name>
 * *** <Weapon Cost: x% name>
 * *** <Armor Cost: x% name>
 * **** Alters cost rate of skills that would consume item, weapon, or armor.
 * *** <Item Cost: +/-x name>
 * *** <Weapon Cost: +/-x name>
 * *** <Armor Cost: +/-x name>
 * **** Alters flat costs of skills that would consume item, weapon, or armor.
 * *** <Replace Item name1 Cost: name2>
 * *** <Replace Weapon name1 Cost: name2>
 * *** <Replace Armor name1 Cost: name2>
 * **** Replaces item, weapon, or armor to be consumed for another type.
 * *** Projects with the Skills and States Core already installed will not have
 *     this update, but you can copy over the settings from a new project with
 *     the following steps:
 * **** Create a new project. Install Skills and States Core. Open up the new
 *      project's 'Skill Cost Types'.
 * **** Right click the 'Item Cost' option(s) and click copy.
 * **** Go to the target project's Skills and States Core's 'Skill Cost Types'
 *      plugin parameter. Paste the command where you want it to go.
 * **** Only 'Item Cost' is needed as it encompasses all three types for item,
 *      weapon, and armor costs.
 * 
 * Version 1.38: February 16, 2023
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.37: January 20, 2023
 * * Bug Fixes!
 * ** Fixed a bug that caused equipment to unequip if the needed equipment
 *    traits came from passive states upon learning new skills. Fix by Irina.
 * 
 * Version 1.36: December 15, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** When enemies are defeated with their entire party having a state with the
 *    <Group Defeat> notetag, then the party will gain EXP, Gold, and Drops
 *    before when they wouldn't. Update made by Irina.
 * * New Features!
 * ** New Plugin Parameter added by Irina!
 * *** Plugin Parameters > Skill Settings > Skill Type Window > Window Width
 * **** What is the desired pixel width of this window? Default: 240
 * 
 * Verison 1.35: October 13, 2022
 * * Feature Update!
 * ** Default values for Passive States > Cache > Switch Refresh? and Variable
 *    Refresh? are now set to "false" in order to prevent sudden lag spikes for
 *    those who are unfamiliar with how this setting works.
 * ** Update made by Irina.
 * 
 * Version 1.34: September 29, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina and sponsored by AndyL:
 * *** Plugin Parameters > Gauge Settings
 * **** These settings allow you to make minor tweaks to how the gauges look
 *      ranging from the color used for the labels to the outline types used
 *      for the values.
 * 
 * Version 1.33: August 11, 2022
 * * Bug Fixes!
 * ** Fixed a crash that occurs when performing a custom action sequence
 *    without a skill attached to it. Fix made by Olivia.
 * 
 * Version 1.32: June 16, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Plugin Parameters > Passive State Settings > Cache > Switch Refresh?
 * *** Plugin Parameters > Passive State Settings > Cache > Variable Refresh?
 * **** Refresh all battle members when switches/variables are changed in
 *      battle?
 * **** This is primarily used for passive state conditions involve parameters
 *      that do not update due to cached data until a refresh occurs.
 * **** If this is on, do not spam Switch/Variable changes during battle in
 *      order to prevent lag spikes.
 * 
 * Version 1.31: April 28, 2022
 * * Bug Fixes!
 * ** Custom Slip Damage JS is now totalled correctly into regular slip damage
 *    totals for damage popups. Fix made by Olivia.
 * 
 * Version 1.30: April 14, 2022
 * * Feature Update!
 * ** Changed the state data removal timing to be after JS notetag effects
 *    take place in order for data such as origin data to remain intact. Update
 *    made by Irina.
 * 
 * Version 1.29: March 31, 2022
 * * Bug Fixes!
 * ** Fixed an error with <State x Category Remove: y> not countaing correctly
 *    unless the state count matched the exact amount. The notetag effect
 *    should work properly now. Fix made by Olivia.
 * 
 * Version 1.28: March 10, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** <State x Category Remove: All> updated to allow multiple cases in a
 *    single notebox. Updated by Arisu.
 * * New Features!
 * ** New Notetag added by Arisu and sponsored by Archeia!
 * *** <Remove Other x States>
 * **** When the state with this notetag is added, remove other 'x' category
 *      states from the battler (except for the state being added).
 * **** Useful for thing state types like stances and forms that there is
 *      usually only one active at a time.
 * 
 * Version 1.27: January 27, 2022
 * * Bug Fixes!
 * ** Custom JS Slip Damage/Healing values should now be recalculated on
 *    demand. Fix made by Olivia.
 * 
 * Version 1.26: January 20, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Conditional Passive Bypass check is now stronger to prevent even more
 *    infinite loops from happening. Update made by Olivia.
 * * New Features!
 * ** New Plugin Parameter added by Olivia:
 * *** Plugin Parameters > State Settings > General > Turn End on Map
 * **** Update any state and buff turns on the map after this many steps.
 * **** Use 0 to disable.
 * 
 * Version 1.25: November 11, 2021
 * * Bug Fixes!
 * ** Hidden skill notetags should no longer crash upon not detecting actors
 *    for learned skills. Fix made by Olivia.
 * 
 * Version 1.24: November 4, 2021
 * * Documentation Update!
 * ** Added section: "Slip Damage Popup Clarification"
 * *** Slip Damage popups only show one popup for HP, MP, and TP each and it is
 *     the grand total of all the states and effects combined regardless of the
 *     number of states and effects on a battler. This is how it is in vanilla
 *     RPG Maker MZ and this is how we intend for it to be with the VisuStella
 *     MZ library.
 * *** This is NOT a bug!
 * *** The reason we are not changing this is because it does not properly
 *     relay information to the player accurately. When multiple popups appear,
 *     players only have roughly a second and a half to calculate it all for
 *     any form of information takeaway. We feel it is better suited for the
 *     player's overall convenience to show a cummulative change and steer the
 *     experience towards a more positive one.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.23: September 17, 2021
 * * Compatibility Update!
 * ** RPG Maker MZ 1.3.3 compatibility.
 * *** Updated how gauges are drawn.
 * *** Skill Cost Types Plugin Parameters need to be updated for those who want
 *     the updated gauges. This can be done easily with the following steps:
 * **** Step 1: Create a new project.
 * **** Step 2: Install Skills and States Core version 1.23 into it.
 * **** Step 3: Copy the Plugin Parameter Settings for "Skill Cost Types".
 * **** Step 4: Return back to your original project.
 * **** Step 5: Paste Plugin Parameter Settings on top of "Skill Cost Types".
 * 
 * Version 1.22: August 6, 2021
 * * Documentation Update!
 * ** "Action End Removal for States" under Major Updates is changed to:
 * *** If your Plugin Parameter settings for "Action End Update" are enabled,
 *     then "Action End" has been updated so that it actually applies per
 *     action used instead of just being at the start of a battler's action
 *     set.
 * *** However, there are side effects to this: if a state has the "Cannot
 *     Move" restriction along with the "Action End" removal timing, then
 *     unsurprisingly, the state will never wear off because it's now based on
 *     actual actions ending. To offset this and remove confusion, "Action End"
 *     auto-removal timings for states with "Cannot Move" restrictions will be
 *     turned into "Turn End" auto-removal timings while the "Action End
 *     Update" is enabled.
 * *** This automatic change won't make it behave like an "Action End" removal
 *     timing would, but it's better than completely softlocking a battler.
 * * Feature Update!
 * ** Those using "Cannot Move" states with "Action End" auto-removal will now
 *    have be automatically converted into "Turn End" auto-removal if the
 *    plugin parameter "Action End Update" is set to true. Update by Irina.
 * 
 * Version 1.21: July 30, 2021
 * * Documentation Update!
 * ** Expanded "Action End Removal for States" section in Major Changes.
 * *** These changes have been in effect since Version 1.07 but have not been
 *     explained in excess detail in the documentation since.
 * **** Action End has been updated so that it actually applies per action used
 *      instead of just being at the start of a battler's action set. However,
 *      there are side effects to this: if a state has the "Cannot Move"
 *      restriction along with the "Action End" removal timing, then
 *      unsurprisingly, the state will never wear off because it's now based on
 *      actual actions ending. There are two solutions to this:
 * **** Don't make "Cannot Move" restriction states with "Action End". This is
 *      not a workaround. This is how the state removal is intended to work
 *      under the new change.
 * **** Go to the Skills & States Core Plugin Parameters, go to State
 *      Setttings, look for "Action End Update", and set it to false. You now
 *      reverted the removal timing system back to how it originally was in RPG
 *      Maker MZ's default battle system where it only updates based on an
 *      action set rather than per actual action ending.
 * 
 * Version 1.20: June 18, 2021
 * * Feature Update!
 * ** Updated automatic caching for conditional passive states to update more
 *    efficiently. Update made by Arisu.
 * 
 * Version 1.19: June 4, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.18: May 21, 2021
 * * Documentation Update
 * ** Added "Passive State Clarification" section.
 * *** As there is a lot of confusion regarding how passive states work and how
 *     people still miss the explanations found in the "Passive State Notetags"
 *     section AND the "Plugin Parameters: Passive State Settings", we are
 *     adding a third section to explain how they work.
 * *** All three sections will contain the full detailed explanation of how
 *     passive states work to clear common misconceptions about them.
 * 
 * Version 1.17: May 7, 2021
 * * Bug Fixes
 * ** State category removal is now usable outside of battle. Fix by Irina.
 * 
 * Version 1.16: April 30, 2021
 * * Bug Fixes!
 * ** When states with step removal have the <No Recover All Clear> or
 *    <No Death Clear> notetags, their step counter is no longer reset either.
 *    Fix made by Irina.
 * * New Features!
 * ** New notetag added by Arisu!
 * *** <List Name: name>
 * **** Makes the name of the skill appear different when show in the skill
 *      list. Using \V[x] as a part of the name will display that variable.
 * 
 * Version 1.15: March 19, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.14: March 12, 2021
 * * Bug Fixes!
 * ** Max HP Buff/Debuff should now display its turn counter. Fix by Yanfly.
 * * Documentation Update!
 * ** For the <JS Passive Condition>, we've added documentation on the
 *    limitations of passive conditions since they have been reported as bug
 *    reports, when in reality, they are failsafes to prevent infinite loops.
 *    Such limitations include the following:
 * *** A passive state that requires another passive state
 * *** A passive state that requires a trait effect from another state
 * *** A passive state that requires a parameter value altered by another state
 * *** A passive state that requires equipment to be worn but its equipment
 *     type access is provided by another state.
 * *** Anything else that is similar in style.
 * 
 * Version 1.13: February 26, 2021
 * * Documentation Update!
 * ** For <JS type Slip Damage> and <JS type Slip Heal> notetags, added the
 *    following notes:
 * *** When these states are applied via action effects, the slip calculations
 *     are one time calculations made upon applying and the damage is cached to
 *     be used for future on regeneration calculations.
 * *** For that reason, do not include game mechanics here such as adding
 *     states, buffs, debuffs, etc. as this notetag is meant for calculations
 *     only. Use the VisuStella Battle Core's <JS Pre-Regenerate> and
 *     <JS Post-Regenerate> notetags for game mechanics instead.
 * *** Passive states and states with the <JS Slip Refresh> notetag are exempt
 *     from the one time calculation and recalculated each regeneration phase.
 * * Feature Update!
 * ** Changed slip refresh requirements to entail <JS Slip Refresh> notetag for
 *    extra clarity. Update made by Olivia.
 * 
 * Version 1.12: February 19, 2021
 * * Feature Update
 * ** Changed the way passive state infinite stacking as a blanket coverage.
 *    Update made by Olivia.
 * 
 * Version 1.11: February 12, 2021
 * * Bug Fixes!
 * ** Added a check to prevent passive states from infinitely stacking. Fix
 *    made by Olivia.
 * 
 * Version 1.10: January 15, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameters added
 * *** Plugin Parameters > Skill Settings > Background Type
 * 
 * Version 1.09: January 1, 2021
 * * Bug Fixes!
 * ** Custom JS TP slip damage and healing should now work properly.
 *    Fix made by Yanfly.
 * 
 * Version 1.08: December 25, 2020
 * * Bug Fixes!
 * ** <JS On Add State> should no longer trigger multiple times for the death
 *    state. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for updated feature(s)!
 * * Feature Update!
 * ** <No Death Clear> can now allow the affected state to be added to an
 *    already dead battler. Update made by Yanfly.
 * 
 * Version 1.07: December 18, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New notetags added by Yanfly:
 * *** <Passive Condition Multiclass: id>
 * *** <Passive Condition Multiclass: id, id, id>
 * *** <Passive Condition Multiclass: name>
 * *** <Passive Condition Multiclass: name, name, name>
 * ** New Plugin Parameter added by Yanfly.
 * *** Plugin Parameters > States > General > Action End Update
 * **** States with "Action End" auto-removal will also update turns at the end
 *      of each action instead of all actions.
 * ***** Turn this off if you wish for state turn updates to function like they
 *       do by default for "Action End".
 * 
 * Version 1.06: December 4, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.05: November 15, 2020
 * * Bug Fixes!
 * ** The alignment of the Skill Type Window is now fixed and will reflect upon
 *    the default settings. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** <State x Category Remove: All> notetag added by Yanfly.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.04: September 27, 2020
 * * Documentation Update
 * ** "Use Updated Layout" plugin parameters now have the added clause:
 *    "This will override the Core Engine windows settings." to reduce
 *    confusion. Added by Irina.
 * 
 * Version 1.03: September 13, 2020
 * * Bug Fixes!
 * ** <JS type Slip Damage> custom notetags now work for passive states. Fix
 *    made by Olivia.
 * ** Setting the Command Window style to "Text Only" will no longer add in
 *    the icon text codes. Bug fixed by Yanfly.
 * 
 * Version 1.02: August 30, 2020
 * * Bug Fixes!
 * ** The JS Notetags for Add, Erase, and Expire states are now fixed. Fix made
 *    by Yanfly.
 * * Documentation Update!
 * ** <Show if learned Skill: x> and <Hide if learned Skill: x> notetags have
 *    the following added to their descriptions:
 * *** This does not apply to skills added by traits on actors, classes, any
 *     equipment, or states. These are not considered learned skills. They are
 *     considered temporary skills.
 * * New Features!
 * ** Notetags added by Yanfly:
 * *** <Show if has Skill: x>
 * *** <Show if have All Skills: x,x,x>
 * *** <Show if have Any Skills: x,x,x>
 * *** <Show if has Skill: name>
 * *** <Show if have All Skills: name, name, name>
 * *** <Show if have Any Skills: name, name, name>
 * *** <Hide if has Skill: x>
 * *** <Hide if have All Skills: x,x,x>
 * *** <Hide if have Any Skills: x,x,x>
 * *** <Hide if has Skill: name>
 * *** <Hide if have All Skills: name, name, name>
 * *** <Hide if have Any Skills: name, name, name>
 * *** These have been added to remove the confusion regarding learned skills
 *     as skills added through trait effects are not considered learned skills
 *     by RPG Maker MZ.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Passive states from Elements & Status Menu Core are now functional.
 *    Fix made by Olivia.
 * * Compatibility Update
 * ** Extended functions to allow for better compatibility.
 * * Updated documentation
 * ** Explains that passive states are not directly applied and are therefore
 *    not affected by code such as "a.isStateAffected(10)".
 * ** Instead, use "a.states().includes($dataStates[10])"
 * ** "Use #rrggbb for a hex color." lines now replaced with
 *    "For a hex color, use #rrggbb with VisuMZ_1_MessageCore"
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillActorPaySkillCost
 * @text Skill Cost: Emulate Actor Pay
 * @desc Target actor(s) emulates paying for skill cost.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) will pay skill cost.
 * @default ["1"]
 *
 * @arg SkillID:num
 * @text Skill ID
 * @type skill
 * @desc What is the ID of the skill to emulate paying the skill cost for?
 * @default 99
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillEnemyPaySkillCost
 * @text Skill Cost: Emulate Enemy Pay
 * @desc Target enemy(s) emulates paying for skill cost.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) will pay skill cost.
 * @default ["1"]
 *
 * @arg SkillID:num
 * @text Skill ID
 * @type skill
 * @desc What is the ID of the skill to emulate paying the skill cost for?
 * @default 99
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_StateTurns
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsActorChangeBy
 * @text State Turns: Actor State Turns Change By
 * @desc Changes actor(s) state turns by an amount.
 * Only works on states that can have turns.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns By
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default +1
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if actor(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsActorChangeTo
 * @text State Turns: Actor State Turns Change To
 * @desc Changes actor(s) state turns to a specific value.
 * Only works on states that can have turns.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns To
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default 10
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if actor(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsEnemyChangeBy
 * @text State Turns: Enemy State Turns Change By
 * @desc Changes enemy(s) state turns by an amount.
 * Only works on states that can have turns.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns By
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default +1
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if enemy(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsEnemyChangeTo
 * @text State Turns: Enemy State Turns Change To
 * @desc Changes enemy(s) state turns to a specific value.
 * Only works on states that can have turns.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns To
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default 10
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if enemy(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param SkillsStatesCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Skills:struct
 * @text Skill Settings
 * @type struct<Skills>
 * @desc Adjust general skill settings here.
 * @default {"General":"","EnableLayout:eval":"true","LayoutStyle:str":"upper/left","SkillTypeWindow":"","CmdStyle:str":"auto","CmdTextAlign:str":"left","ListWindow":"","ListWindowCols:num":"1","ShopStatusWindow":"","ShowShopStatus:eval":"true","SkillSceneAdjustSkillList:eval":"true","SkillMenuStatusRect:func":"\"const ww = this.shopStatusWidth();\\nconst wh = this._itemWindow.height;\\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\\nconst wy = this._itemWindow.y;\\nreturn new Rectangle(wx, wy, ww, wh);\"","SkillTypes":"","HiddenSkillTypes:arraynum":"[]","BattleHiddenSkillTypes:arraynum":"[]","IconStypeNorm:num":"78","IconStypeMagic:num":"79","CustomJS":"","SkillConditionJS:func":"\"// Declare Variables\\nconst skill = arguments[0];\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet enabled = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn enabled;\""}
 *
 * @param Costs:arraystruct
 * @text Skill Cost Types
 * @parent Skills:struct
 * @type struct<Cost>[]
 * @desc A list of all the skill cost types added by this plugin
 * and the code that controls them in-game.
 * @default ["{\"Name:str\":\"HP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"20\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mhp / 100);\\\\n}\\\\nif (note.match(/<JS HP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS HP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<HP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<HP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<HP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<HP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nif (cost <= 0) {\\\\n    return true;\\\\n} else {\\\\n    return user._hp > cost;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._hp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.hp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mhp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.hp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.hpGaugeColor1();\\\\nconst color2 = ColorManager.hpGaugeColor2();\\\\nconst label = TextManager.hpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.hpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"MP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"23\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = Math.floor(skill.mpCost * user.mcr);\\\\nif (note.match(/<MP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mmp / 100);\\\\n}\\\\nif (note.match(/<JS MP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS MP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<MP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<MP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<MP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<MP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._mp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._mp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.mp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mmp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.mpGaugeColor1();\\\\nconst color2 = ColorManager.mpGaugeColor2();\\\\nconst label = TextManager.mpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.mpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"TP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"29\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = skill.tpCost;\\\\nif (note.match(/<TP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.maxTp() / 100);\\\\n}\\\\nif (note.match(/<JS TP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS TP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<TP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<TP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<TP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<TP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._tp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._tp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.tp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.maxTp();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.tp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.tpGaugeColor1();\\\\nconst color2 = ColorManager.tpGaugeColor2();\\\\nconst label = TextManager.tpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.tpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Gold\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"17\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * $gameParty.gold() / 100);\\\\n}\\\\nif (note.match(/<JS GOLD COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS GOLD COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<GOLD COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<GOLD COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<GOLD COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<GOLD COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn $gameParty.gold() >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\n$gameParty.loseGold(cost);\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.currencyUnit;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxGold();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.gold();\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.currencyUnit;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Potion\",\"Settings\":\"\",\"Icon:num\":\"176\",\"FontColor:str\":\"0\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<POTION COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<JS POTION COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS POTION COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<POTION COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<POTION COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<POTION COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<POTION COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return Boolean\\\\nif (user.isActor() && cost > 0) {\\\\n    return $gameParty.numItems(item) >= cost;\\\\n} else {\\\\n    return true;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Process Payment\\\\nif (user.isActor()) {\\\\n    $gameParty.loseItem(item, cost);\\\\n}\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = settings.Name;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '×%1'.format(cost);\\\\n\\\\n// Text: Add Icon\\\\ntext += '\\\\\\\\\\\\\\\\I[%1]'.format(item.iconIndex);\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxItems(item);\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.numItems(item);\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.textColor(30);\\\\nconst color2 = ColorManager.textColor(31);\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst item = $dataItems[7];\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Icon\\\\nconst iconIndex = item.iconIndex;\\\\nconst iconBitmap = ImageManager.loadSystem(\\\\\\\"IconSet\\\\\\\");\\\\nconst pw = ImageManager.iconWidth;\\\\nconst ph = ImageManager.iconHeight;\\\\nconst sx = (iconIndex % 16) * pw;\\\\nconst sy = Math.floor(iconIndex / 16) * ph;\\\\nbitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0, 24, 24);\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Item Cost\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"0\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = {\\\\n    items: {},\\\\n    weapons: {},\\\\n    armors: {},\\\\n};\\\\n\\\\n// Gather Cost Notetags\\\\n{ // Item Costs\\\\n    const notetag = /<ITEM COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.items[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Weapon Costs\\\\n    const notetag = /<WEAPON COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.weapons[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Armor Costs\\\\n    const notetag = /<ARMOR COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.armors[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Declare Trait Objects\\\\nconst traitObjects = user.traitObjects();\\\\n\\\\n// Apply Cost Rate Modifiers\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Cost Rate Modifiers\\\\n        const notetag = /<ITEM COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id]) {\\\\n                    cost.items[entry.id] = Math.ceil(cost.items[entry.id] * rate);\\\\n                    if (cost.items[entry.id] <= 0) cost.items[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Cost Rate Modifiers\\\\n        const notetag = /<WEAPON COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id]) {\\\\n                    cost.weapons[entry.id] = Math.ceil(cost.weapons[entry.id] * rate);\\\\n                    if (cost.weapons[entry.id] <= 0) cost.weapons[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Cost Rate Modifiers\\\\n        const notetag = /<ARMOR COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id]) {\\\\n                    cost.armors[entry.id] = Math.ceil(cost.armors[entry.id] * rate);\\\\n                    if (cost.armors[entry.id] <= 0) cost.armors[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Apply Flat Cost Modifiers\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Flat Cost Modifiers\\\\n        const notetag = /<ITEM COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id]) {\\\\n                    cost.items[entry.id] += flat;\\\\n                    if (cost.items[entry.id] <= 0) cost.items[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Flat Cost Modifiers\\\\n        const notetag = /<WEAPON COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id]) {\\\\n                    cost.weapons[entry.id] += flat;\\\\n                    if (cost.weapons[entry.id] <= 0) cost.weapons[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Flat Cost Modifiers\\\\n        const notetag = /<ARMOR COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id]) {\\\\n                    cost.armors[entry.id] += flat;\\\\n                    if (cost.armors[entry.id] <= 0) cost.armors[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Set Cost Limits\\\\n{ // Item Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<ITEM COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id] !== undefined) {\\\\n                    cost.items[entry.id] = Math.min(max, cost.items[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<ITEM COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id] !== undefined) {\\\\n                    cost.items[entry.id] = Math.max(min, cost.items[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Weapon Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<WEAPON COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id] !== undefined) {\\\\n                    cost.weapons[entry.id] = Math.min(max, cost.weapons[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<WEAPON COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id] !== undefined) {\\\\n                    cost.weapons[entry.id] = Math.max(min, cost.weapons[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Armor Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<ARMOR COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id] !== undefined) {\\\\n                    cost.armors[entry.id] = Math.min(max, cost.armors[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<ARMOR COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id] !== undefined) {\\\\n                    cost.armors[entry.id] = Math.max(min, cost.armors[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Apply Replacement Costs\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Replacement Costs\\\\n        const notetag = /<REPLACE ITEM (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.items[entry1.id]) {\\\\n                    cost.items[entry2.id] = cost.items[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Replacement Costs\\\\n        const notetag = /<REPLACE WEAPON (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.weapons[entry1.id]) {\\\\n                    cost.weapons[entry2.id] = cost.weapons[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Replacement Costs\\\\n        const notetag = /<REPLACE ARMOR (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.armors[entry1.id]) {\\\\n                    cost.armors[entry2.id] = cost.armors[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Return cost data\\\\nreturn cost;\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Check Individual Costs\\\\n{ // Check Item Costs\\\\n    for (let id in cost.items) {\\\\n        const obj = $dataItems[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.items[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Weapon Costs\\\\n    for (let id in cost.weapons) {\\\\n        const obj = $dataWeapons[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.weapons[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Armor Costs\\\\n    for (let id in cost.armors) {\\\\n        const obj = $dataArmors[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.armors[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Return True\\\\nreturn true;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\n{ // Check Item Costs\\\\n    for (let id in cost.items) {\\\\n        const obj = $dataItems[id];\\\\n        if (obj && obj.consumable) {\\\\n            if (obj.itypeId !== 2) {\\\\n                const costAmount = cost.items[id];\\\\n                $gameParty.loseItem(obj, costAmount);\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Weapon Costs\\\\n    for (let id in cost.weapons) {\\\\n        const obj = $dataWeapons[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.weapons[id];\\\\n            $gameParty.loseItem(obj, costAmount);\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Armor Costs\\\\n    for (let id in cost.armors) {\\\\n        const obj = $dataArmors[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.armors[id];\\\\n            $gameParty.loseItem(obj, costAmount);\\\\n        }\\\\n    }\\\\n}\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Check Keys\\\\nconst keys = ['items', 'weapons', 'armors'];\\\\n\\\\n// Return False\\\\nreturn keys.some(key => Object.keys(cost[key]).length > 0);\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = settings.Name;\\\\nconst icon = settings.Icon;\\\\nconst keys = ['items', 'weapons', 'armors'];\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\nfor (const key of keys) {\\\\n    const database = [$dataItems, $dataWeapons, $dataArmors][keys.indexOf(key)];\\\\n    const costData = cost[key];\\\\n    const idList = Object.keys(costData).sort((a, b) => a - b);\\\\n    for (const id of idList) {\\\\n        const obj = database[id];\\\\n        const iconIndex = obj.iconIndex;\\\\n        const costAmount = costData[id];\\\\n        text += '\\\\\\\\\\\\\\\\I[%1]×%2 '.format(iconIndex, costAmount);\\\\n    }\\\\n}\\\\n\\\\n// Return text\\\\nreturn text.trim();\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn 0;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn 0;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Don't Draw Anything\\\\n// This does not work as a gauge.\\\"\"}"]
 *
 * @param Toggles:struct
 * @text Skill Toggle Settings
 * @parent Skills:struct
 * @type struct<Toggles>
 * @desc Settings in regards to how skill toggles function.
 * @default {"Default":"","DefaultToggle:eval":"true","ToggleOffAnimationID:num":"62","Appear":"","ToggleOnTextColor:str":"24","Vocab":"","ToggleType:str":"Toggle","ToggleOn:str":"\\FS[22]\\C[0][ON]","ToggleOff:str":"\\FS[22]\\C[8][OFF]","ToggleOffLocation:str":"back"}
 *
 * @param Gauge:struct
 * @text Gauge Settings
 * @parent Skills:struct
 * @type struct<Gauge>
 * @desc Settings in regards to how skill cost gauges function and appear.
 * @default {"Labels":"","LabelFontMainType:str":"main","MatchLabelColor:eval":"true","MatchLabelGaugeColor:num":"2","PresetLabelGaugeColor:num":"16","LabelOutlineSolid:eval":"true","LabelOutlineWidth:num":"3","Values":"","ValueFontMainType:str":"number","ValueOutlineSolid:eval":"true","ValueOutlineWidth:num":"3"}
 *
 * @param BreakSkills
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param States:struct
 * @text State Settings
 * @type struct<States>
 * @desc Adjust general state settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","ActionEndUpdate:eval":"true","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorNeutral:str":"0","ColorPositive:str":"24","ColorNegative:str":"27","Data":"","ShowData:eval":"true","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\"","onEraseStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param Buffs:struct
 * @text Buff/Debuff Settings
 * @parent States:struct
 * @type struct<Buffs>
 * @desc Adjust general buff/debuff settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","Stacking":"","StackBuffMax:num":"2","StackDebuffMax:num":"2","MultiplierJS:func":"\"// Declare Variables\\nconst user = this;\\nconst paramId = arguments[0];\\nconst buffLevel = arguments[1];\\nlet rate = 1;\\n\\n// Perform Calculations\\nrate += buffLevel * 0.25;\\n\\n// Return Rate\\nreturn Math.max(0, rate);\"","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorBuff:str":"24","ColorDebuff:str":"27","Data":"","ShowData:eval":"false","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onAddDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param PassiveStates:struct
 * @text Passive States
 * @parent States:struct
 * @type struct<PassiveStates>
 * @desc Adjust passive state settings here.
 * @default {"List":"","Global:arraynum":"[]","Actor:arraynum":"[]","Enemy:arraynum":"[]","CustomJS":"","PassiveConditionJS:func":"\"// Declare Variables\\nconst state = arguments[0];\\nconst stateId = state.id;\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet condition = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn condition;\""}
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * General Skill Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Skills:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Skill Menu Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/left
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent SkillTypeWindow
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Skill Type Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent SkillTypeWindow
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Skill Type Window.
 * @default left
 * 
 * @param CmdWidth:num
 * @text Window Width
 * @parent SkillTypeWindow
 * @type number
 * @min 1
 * @desc What is the desired pixel width of this window?
 * Default: 240
 * @default 240
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListWindowCols:num
 * @text Columns
 * @parent ListWindow
 * @type number
 * @min 1
 * @desc Number of maximum columns.
 * @default 1
 *
 * @param ShopStatusWindow
 * @text Shop Status Window
 *
 * @param ShowShopStatus:eval
 * @text Show in Skill Menu?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the Shop Status Window in the Skill Menu?
 * This is enabled if the Updated Layout is on.
 * @default true
 *
 * @param SkillSceneAdjustSkillList:eval
 * @text Adjust List Window?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the Skill List Window in the Skill Menu if using the Shop Status Window?
 * @default true
 *
 * @param SkillSceneStatusBgType:num
 * @text Background Type
 * @parent ShopStatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SkillMenuStatusRect:func
 * @text JS: X, Y, W, H
 * @parent ShopStatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this Shop Status Window in the Skill Menu.
 * @default "const ww = this.shopStatusWidth();\nconst wh = this._itemWindow.height;\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\nconst wy = this._itemWindow.y;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param SkillTypes
 * @text Skill Types
 *
 * @param HiddenSkillTypes:arraynum
 * @text Hidden Skill Types
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden from view ingame.
 * @default []
 *
 * @param BattleHiddenSkillTypes:arraynum
 * @text Hidden During Battle
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden during battle only.
 * @default []
 *
 * @param IconStypeNorm:num
 * @text Icon: Normal Type
 * @parent SkillTypes
 * @desc Icon used for normal skill types that aren't assigned any icons.
 * @default 78
 *
 * @param IconStypeMagic:num
 * @text Icon: Magic Type
 * @parent SkillTypes
 * @desc Icon used for magic skill types that aren't assigned any icons.
 * @default 79
 *
 * @param SortSkillTypesAbc:arraynum
 * @text Sort: Alphabetical
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of Skill Types you want sorted alphabetically.
 * @default []
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param SkillConditionJS:func
 * @text JS: Skill Conditions
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide skill condition check.
 * @default "// Declare Variables\nconst skill = arguments[0];\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet enabled = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn enabled;"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Cost Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Cost:
 *
 * @param Name:str
 * @text Name
 * @desc A name for this Skill Cost Type.
 * @default Untitled
 *
 * @param Settings
 *
 * @param Icon:num
 * @text Icon
 * @parent Settings
 * @desc Icon used for this Skill Cost Type.
 * Use 0 for no icon.
 * @default 0
 *
 * @param FontColor:str
 * @text Font Color
 * @parent Settings
 * @desc Text Color used to display this cost.
 * For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * @default 0
 *
 * @param FontSize:num
 * @text Font Size
 * @parent Settings
 * @type number
 * @min 1
 * @desc Font size used to display this cost.
 * @default 22
 *
 * @param Cost
 * @text Cost Processing
 *
 * @param CalcJS:func
 * @text JS: Cost Calculation
 * @parent Cost
 * @type note
 * @desc Code on how to calculate this resource cost for the skill.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nlet cost = 0;\n\n// Return cost value\nreturn Math.round(Math.max(0, cost));"
 *
 * @param CanPayJS:func
 * @text JS: Can Pay Cost?
 * @parent Cost
 * @type note
 * @desc Code on calculating whether or not the user is able to pay the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn true;"
 *
 * @param PayJS:func
 * @text JS: Paying Cost
 * @parent Cost
 * @type note
 * @desc Code for if met, this is the actual process of paying of the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Process Payment\n"
 *
 * @param Windows
 * @text Window Display
 *
 * @param ShowJS:func
 * @text JS: Show Cost?
 * @parent  Windows
 * @type note
 * @desc Code for determining if the cost is shown or not.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn cost > 0;"
 *
 * @param TextJS:func
 * @text JS: Cost Text
 * @parent  Windows
 * @type note
 * @desc Code to determine the text (with Text Code support) used for the displayed cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\nconst settings = arguments[2];\nconst fontSize = settings.FontSize;\nconst color = settings.FontColor;\nconst name = settings.Name;\nconst icon = settings.Icon;\nlet text = '';\n\n// Text: Change Font Size\ntext += '\\\\FS[%1]'.format(fontSize);\n\n// Text: Add Color\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\n    text += '\\\\HexColor<#%1>'.format(String(RegExp.$1));\n} else {\n    text += '\\\\C[%1]'.format(color);\n}\n\n// Text: Add Cost\ntext += '%1 %2'.format(cost, name);\n\n// Text: Add Icon\nif (icon  > 0) {\n    text += '\\\\I[%1]'.format(icon);\n}\n\n// Return text\nreturn text;"
 *
 * @param Gauges
 * @text Gauge Display
 *
 * @param GaugeMaxJS:func
 * @text JS: Maximum Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the maximum value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeCurrentJS:func
 * @text JS: Current Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the current value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeDrawJS:func
 * @text JS: Draw Gauge
 * @parent  Gauges
 * @type note
 * @desc Code to determine how to draw the Skill Cost resource for this gauge type.
 * @default "// Declare Variables\nconst sprite = this;\nconst settings = sprite._costSettings;\nconst bitmap = sprite.bitmap;\nconst user = sprite._battler;\nconst currentValue = sprite.currentDisplayedValue();\n\n// Draw Gauge\nconst color1 = ColorManager.textColor(30);\nconst color2 = ColorManager.textColor(31);\nconst gx = 0;\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\nconst gw = sprite.bitmapWidth() - gx;\nconst gh = sprite.gaugeHeight();\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\n\n// Draw Label\nconst label = settings.Name;\nconst lx = 4;\nconst ly = 0;\nconst lw = sprite.bitmapWidth();\nconst lh = sprite.bitmapHeight();\nsprite.setupLabelFont();\nbitmap.paintOpacity = 255;\nbitmap.drawText(label, lx, ly, lw, lh, \"left\");\n\n// Draw Value\nconst vw = sprite.bitmapWidth() - 2;\nconst vh = sprite.bitmapHeight();\nsprite.setupValueFont();\nbitmap.textColor = ColorManager.normalColor();\nbitmap.drawText(currentValue, 0, 0, vw, vh, \"right\");"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Toggle Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Toggles:
 *
 * @param Default
 *
 * @param DefaultToggle:eval
 * @text Default Toggle
 * @parent Default
 * @type boolean
 * @on ON
 * @off OFF
 * @desc What is the default toggle setting for toggle skills?
 * @default true
 *
 * @param ToggleOffAnimationID:num
 * @text Toggle Off Animation
 * @parent Default
 * @type animation
 * @desc Play this animation when a skill is toggled off.
 * Requires VisuMZ_0_CoreEngine.
 * @default 62
 *
 * @param Appear
 * @text Appearance
 *
 * @param ToggleOnTextColor:str
 * @text Toggle On Text Color
 * @parent Appear
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param Vocab
 * @text Vocabulary
 *
 * @param ToggleType:str
 * @text Toggle Type
 * @parent Vocab
 * @desc Skill toggle displayed in the status window.
 * @default Toggle
 *
 * @param ToggleOn:str
 * @text Toggle On
 * @parent Vocab
 * @desc Text displayed for a skill that's toggled on
 * @default \FS[22]\C[0][ON]
 *
 * @param ToggleOff:str
 * @text Toggle Off
 * @parent Vocab
 * @desc Text displayed for a skill that's toggled off
 * @default \FS[22]\C[8][OFF]
 *
 * @param ToggleOffLocation:str
 * @text Off Text Location
 * @parent ToggleOff:str
 * @type select
 * @option front
 * @option back
 * @desc Where is the [OFF] text located in the skill cost?
 * @default back
 *
 */
/* ----------------------------------------------------------------------------
 * Gauge Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gauge:
 *
 * @param Labels
 *
 * @param LabelFontMainType:str
 * @text Font Type
 * @parent Labels
 * @type select
 * @option main
 * @option number
 * @desc Which font type should be used for labels?
 * @default main
 *
 * @param MatchLabelColor:eval
 * @text Match Label Color
 * @parent Labels
 * @type boolean
 * @on Match
 * @off Preset
 * @desc Match the label color to the Gauge Color being used?
 * @default true
 *
 * @param MatchLabelGaugeColor:num
 * @text Match: Gauge # ?
 * @parent MatchLabelColor:eval
 * @type number
 * @min 1
 * @max 2
 * @desc Which Gauge Color should be matched?
 * @default 2
 *
 * @param PresetLabelGaugeColor:num
 * @text Preset: Gauge Color
 * @parent MatchLabelColor:eval
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 16
 *
 * @param LabelOutlineSolid:eval
 * @text Solid Outline
 * @parent Labels
 * @type boolean
 * @on Solid
 * @off Semi-Transparent
 * @desc Make the label outline a solid black color?
 * @default true
 *
 * @param LabelOutlineWidth:num
 * @text Outline Width
 * @parent Labels
 * @type number
 * @min 0
 * @desc What width do you wish to use for your outline?
 * Use 0 to not use an outline.
 * @default 3
 *
 * @param Values
 *
 * @param ValueFontMainType:str
 * @text Font Type
 * @parent Values
 * @type select
 * @option main
 * @option number
 * @desc Which font type should be used for values?
 * @default number
 *
 * @param ValueOutlineSolid:eval
 * @text Solid Outline
 * @parent Values
 * @type boolean
 * @on Solid
 * @off Semi-Transparent
 * @desc Make the value outline a solid black color?
 * @default true
 *
 * @param ValueOutlineWidth:num
 * @text Outline Width
 * @parent Values
 * @type number
 * @min 0
 * @desc What width do you wish to use for your outline?
 * Use 0 to not use an outline.
 * @default 3
 *
 */
/* ----------------------------------------------------------------------------
 * General State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~States:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: State doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying states.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let states go up to.
 * This can be changed with the <Max Turns: x> notetag.
 * @default 9999
 *
 * @param ActionEndUpdate:eval
 * @text Action End Update
 * @parent General
 * @type boolean
 * @on Update Each Action
 * @off Don't Change
 * @desc Refer to "Major Changes" in Help File for explanation.
 * @default true
 *
 * @param TurnEndOnMap:num
 * @text Turn End on Map
 * @parent General
 * @type number
 * @desc Update any state and buff turns on the map after
 * this many steps. Use 0 to disable.
 * @default 20
 *
 * @param Turns
 * @text Turn Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param ColorNeutral:str
 * @text Turn Color: Neutral
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorPositive:str
 * @text Turn Color: Positive
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorNegative:str
 * @text Turn Color: Negative
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Data Display
 *
 * @param ShowData:eval
 * @text Show Data?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state data on top of window icons and sprites?
 * @default true
 *
 * @param DataFontSize:num
 * @text Data Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying state data.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the state data display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the state data display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddStateJS:func
 * @text JS: On Add State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is added.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseStateJS:func
 * @text JS: On Erase State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is erased.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireStateJS:func
 * @text JS: On Expire State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state has expired.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * General Buff/Debuff Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Buffs:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: Buff/Debuff doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying buffs/debuffs.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let buffs and debuffs go up to.
 * @default 9999
 *
 * @param Stacking
 *
 * @param StackBuffMax:num
 * @text Max Stacks: Buff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for buffs.
 * @default 2
 *
 * @param StackDebuffMax:num
 * @text Max Stacks: Debuff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for debuffs.
 * @default 2
 *
 * @param MultiplierJS:func
 * @text JS: Buff/Debuff Rate
 * @parent Stacking
 * @type note
 * @desc Code to determine how much buffs and debuffs affect parameters.
 * @default "// Declare Variables\nconst user = this;\nconst paramId = arguments[0];\nconst buffLevel = arguments[1];\nlet rate = 1;\n\n// Perform Calculations\nrate += buffLevel * 0.25;\n\n// Return Rate\nreturn Math.max(0, rate);"
 *
 * @param Turns
 * @text Turns Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param ColorBuff:str
 * @text Turn Color: Buffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorDebuff:str
 * @text Turn Color: Debuffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Rate Display
 *
 * @param ShowData:eval
 * @text Show Rate?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff rate on top of window icons and sprites?
 * @default false
 *
 * @param DataFontSize:num
 * @text Rate Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying rate.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the rate display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the rate display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddBuffJS:func
 * @text JS: On Add Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onAddDebuffJS:func
 * @text JS: On Add Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseBuffJS:func
 * @text JS: On Erase Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseDebuffJS:func
 * @text JS: On Erase Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireBuffJS:func
 * @text JS: On Expire Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireDebuffJS:func
 * @text JS: On Expire Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Passive State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~PassiveStates:
 *
 * @param List
 *
 * @param Global:arraynum
 * @text Global Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors and enemies.
 * @default []
 *
 * @param Actor:arraynum
 * @text Actor-Only Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors only.
 * @default []
 *
 * @param Enemy:arraynum
 * @text Enemy Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect enemies only.
 * @default []
 *
 * @param Cache
 *
 * @param RefreshCacheSwitch:eval
 * @text Switch Refresh?
 * @parent Cache
 * @type boolean
 * @on Refresh
 * @off No Changes
 * @desc Refresh all battle members when switches are changed in battle?
 * @default false
 *
 * @param RefreshCacheVar:eval
 * @text Variable Refresh?
 * @parent Cache
 * @type boolean
 * @on Refresh
 * @off No Changes
 * @desc Refresh all battle members when variables are changed in battle?
 * @default false
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param PassiveConditionJS:func
 * @text JS: Condition Check
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide passive condition check.
 * @default "// Declare Variables\nconst state = arguments[0];\nconst stateId = state.id;\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet condition = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn condition;"
 *
 */
//=============================================================================

function _0x4c9b(){const _0x484931=['allSwitchOff','recover\x20all','refreshAllMembers','MAXMP','isToggleSkill','addAuraPassiveStateIDs','Scene_Skill_itemWindowRect','increaseBuff','setStateRetainType','clearStateOrigin','isBuffOrDebuffAffected','Game_Actor_skillTypes','setBuffTurns','CheckBypassRemoveStatesByDamage','overwriteBuffTurns','Game_BattlerBase_eraseState','drawExtendedParameter','hasSkill','statusWidth','initialize','Window_SkillStatus_refresh','ToggleOn','_skillWindow','VisuMZ_3_ItemThrowSkills','makeAdditionalSkillCostText','removeStatesByCategory','Gauge','drawActorIconsAllTurnCounters','setPassiveStateSlipDamageJS','currentValue','ActionEndUpdate','keys','Enemy','index','isSkillHidden','isSkill','Game_Battler_addDebuff','Scene_Skill_createItemWindow','paySkillCost','hasState','onEraseStateJS','addPassiveStatesFromOtherPlugins','JSON','onAddStateGlobalJS','Parse_Notetags_State_ApplyRemoveLeaveJS','createShopStatusWindow','Window_SkillList_includes','scrollTo','fontFace','gainSilentTp','ItemAmplifySkills','sort','buffTurns','ValueFontMainType','passiveStateIDs','isConfused','isUseModernControls','_animationIndex','clearStateDisplay','toggleOffLocation','VisuMZ_2_ClassChangeSystem','onExpireState','clear','changeOutlineColor','Game_BattlerBase_decreaseBuff','executeHpDamage','deathStateId','innerWidth','States','_battler','active','drawActorBuffRates','Sprite_Gauge_currentMaxValue','gainMp','EnableLayout','LayoutStyle','BattleManager_endAction','Game_Variables_onChange','isGroupDefeatStateAffected','hasStateCategory','stateColor','anchor','_statusWindow','Game_Battler_regenerateAll','meetsPassiveStateGlobalConditionJS','_prevPassiveJsCounter','meetsStateCondition','SortByIDandPriority','stateMpSlipHealJS','getPassiveStateConditionSwitchData','anySwitchOn','rgba(0,\x200,\x200,\x200)','ShowJS','onDatabaseLoaded','uiHelpPosition','commandNameWindowDrawText','_cache_getAuraPassiveStatesFromObj','addStateTurns','height','getAuraPassiveStatesFromObj','StackDebuffMax','addBuffTurns','Sprite_Gauge_redraw','stateAddJS','learnSkill','onExpireStateGlobalJS','Game_Troop_setup','addCommand','TurnOffsetX','<enemy-%1>','Game_Battler_addBuff','_stypeId','isUserBypassRemoveStatesByDamage','labelColor','_cache_getPassiveStateConditionSwitchData','setStatusWindow','isBuffExpired','localeCompare','toggleOn','DataFontSize','Window_StatusBase_placeGauge','currentValueSkillsStatesCore','getCurrentStateOriginKey','createTurnDisplaySprite','onSkillOk','_currentTroopUniqueID','ForcedMatrix','shopStatusWindowRectSkillsStatesCore','isAllDead','makeCommandName','itemWindowRect','Game_BattlerBase_initMembers','convertPassiveStates','VisuMZ_1_ItemsEquipsCore','5196DEXUAW','ALL','updateTurnDisplaySprite','stateTpSlipHealJS','auraStateIDs','Enemy-%1-%2','boxWidth','stateCategoriesResisted','meetsSkillConditionsGlobalJS','resetStateCounts','commandNameWindowCenter','makeItemList','makeResistedStateCategories','passiveStates','_commandNameWindow','onAddDebuff','_stateData','drawParamText','gainHp','map','initMembersSkillsStatesCore','meetsPassiveStateConditionSwitches','_classIDs','onAddBuffJS','onExpireDebuffGlobalJS','removeStatesAuto','item','RefreshCacheSwitch','skillLearn','anySwitchOff','\x5cFS[22]\x5cC[0][ON]','onAddStateJS','_stateIDs','CheckVisibleSkillNotetags','Window_StatusBase_drawActorIcons','right','getStateReapplyRulings','Game_Unit_isAllDead','recoverAll','VisuMZ_1_MainMenuCore','onEraseStateGlobalJS','%1\x20%2\x20%3','makeCurrentTroopUniqueID','KnownListRange','registerCommand','StateTurnsEnemyChangeTo','_stateTurns','Parse_Notetags_State_PassiveJS','ToggleOff','Game_BattlerBase_addNewState','isTargetBypassRemoveStatesByDamage','skills','allowCreateShopStatusWindow','ParseAllNotetags','Game_BattlerBase_overwriteBuffTurns','placeGauge','width','isMaxDebuffAffected','SkillContainers','redraw','STRUCT','fontSize','ForceList','StateTurnsEnemyChangeBy','Window_Base_changeTextColor','ToggleOffAnimationID','_cache_getPassiveStateConditionClassesData','buttonAssistText1','skillEnableJS','Window_SkillList_makeItemList','opponentsUnit','Parse_Notetags_State_Category','AvailableMatrix','Game_BattlerBase_isStateResist','Game_Switches_onChange','call','gaugeLineHeight','removeState','drawItemStyleIconText','stateTpSlipDamageJS','\x5cFS[22]\x5cC[8][OFF]','resetFontSettings','currentMaxValue','_checkingTraitsSetSkillsStatesCore','rgba(0,\x200,\x200,\x201)','isBuffAffected','_buffTurns','contents','concat','stateData','CmdStyle','Parse_Notetags_Skill_JS','makeSuccess','floor','valueOutlineColor','updateCommandNameWindow','_skillTypeWindow','_toggleSkillColor','status','checkShowHideJS','isStateRemoved','length','commandStyle','maxCols','_cache','isAppeared','getStateRetainType','uiInputPosition','PassiveStates','Sprite_StateIcon_loadBitmap','note','remove','onSkillToggle','_lastStatesActionEndFrameCount','_checkingVisuMzPassiveStateObjects','SortSkillTypesAbc','toggleExclusionGroups','onRegenerateCustomStateDamageOverTime','mainFontFace','checkSkillConditionsNotetags','TurnEndOnMap','log','MaxTurns','slipMp','SkillSceneStatusBgType','mainCommandWidth','isPartyAllAffectedByGroupDefeatStates','process_VisuMZ_SkillsStatesCore_CheckForAuras','758872WETuGy','commandName','MAXHP','gaugeColor2','Sprite_StateIcon_updateFrame','_result','front','isActor','ARRAYJSON','createSkillCostText','skillTypeWindowRect','_data','number','onAddState','Weapon-%1-%2','activate','mainAreaTop','isEnemy','_cache_toggleExclusionGroups','Buffs','FieldSkill','prototype','ValueOutlineSolid','sortPriority','setStateData','_colorCache','GaugeCurrentJS','getAuraPassiveStateIDs','stateHpSlipHealJS','regenerateAllSkillsStatesCore','hide','MeetsAuraStateConditions','version','deadMembers','equipPassives','applyStateTurnManipulationEffects','_stored_state-%1-color','LabelOutlineSolid','Scene_Skill_skillTypeWindowRect','totalStateCategoryAffected','maxItems','isAlive','convertGaugeTypeSkillsStatesCore','onEraseDebuffJS','makeCommandList','windowPadding','isLearnedSkill','onAddDebuffJS','Game_BattlerBase_clearStates','AutoAddState','Game_Actor_forgetSkill','die','sortSkillList','itemTextAlign','getPassiveStateConditionClassesData','skillMpCost','_states','paramBuffRate','skill','setup','Game_BattlerBase_recoverAll','CanThrowType','Game_Action_isValid','ParseClassIDs','onEraseBuffGlobalJS','applySkillsStatesCoreEffects','SkillEnemyPaySkillCost','Sprite_Gauge_currentValue','adjustSkillCost','split','Item-%1-%2','_stateOrigin','setStateTurns','onEraseBuffJS','getSkillIdWithName','priority','Sprite_Gauge_gaugeRate','drawExtendedSkillsStatesCoreStatus','Scene_Boot_onDatabaseLoaded','testApply','valueFontSize','ItemThrowSkills','Game_Actor_learnSkill','ListWindowCols','itemLineRect','traitObjects','back','isUseSkillsStatesCoreUpdatedLayout','paramValueByName','meetsPassiveStateConditionJS','_subject','Global','changeTextColor','StateTurnsActorChangeBy','_prevPassiveJsFrameCount','DEF','stateMaximumTurns','icon','_bypassRemoveStateDamage_user','LUK','isStateCategoryResisted','createPassiveStatesCache','Game_Battler_addState','actor','states','Game_Battler_isStateAddable','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','auto','isSkillToggled','CanPayJS','InputComboSkills','standardIconHeight','InputKey','_skillIDs','numberFontFace','isStateResist','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','Costs','#%1','setupSkillsStatesCore','description','isStateAddable','checkSkillTypeMatch','requestFauxAnimation','ToggleType','helpAreaTop','Game_Action_applyItemUserEffect','ARRAYNUM','maxSlipDamage','20PjpmLV','applyBuffTurnManipulationEffects','_prevPassiveJsResults','passiveStateObjects','drawActorStateTurns','updateVisibility','exit','iconIndex','getStateData','CanConcoct','drawItemStyleIcon','loadBitmap','%1%','TextJS','HiddenSkillTypes','canUse','810399ZBobLM','statePassiveConditionJS','getColor','onEraseBuff','gaugeRate','_bypassRemoveStateDamage_value','getSkillTypes','retrieveStateColor','ValueOutlineWidth','addNewState','placeExactGauge','Sprite_Gauge_setup','bitmap','addState','skillVisibleJS','format','_skillToggle','labelOutlineWidth','stateHpSlipDamageJS','drawActorIcons','Window_SkillList_setActor','mainFontSize','isBuffPrevented','ARRAYFUNC','removeStatesByDamage','calcWindowHeight','\x0a\x20\x20\x20\x20\x20\x20\x20\x20let\x20%2\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20%2\x20=\x20Math.round(Math.max(0,\x20%2)\x20*\x20%3);\x0a\x20\x20\x20\x20\x20\x20\x20\x20this.setStateData(stateId,\x20\x27%4\x27,\x20%2);\x0a\x20\x20\x20\x20','TurnOffsetY','RegExp','_passiveStateResults','isSceneBattle','setStateDisplay','recalculateSlipDamageJS','applyStateCategoryRemovalEffects','setStypeId','applyItemUserEffect','_skills','name','ShowTurns','isDead','onBattleEnd','Turns','canChangeSkillsThroughStateEffects','StateID','statesByCategory','addPassiveStatesTraitSets','PayJS','ceil','AURA_SYSTEM_ENABLED','toLowerCase','setDebuffTurns','valueOutlineWidth','SkillActorPaySkillCost','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','heal','isBottomHelpMode','onExpireStateJS','isPassiveStateStackable','gradientFillRect','canSortSkillTypeList','updateStateTurns','process_VisuMZ_SkillsStatesCore_State_Notetags','isSkillCostShown','CmdTextAlign','_skillChangesFromState','decreaseBuff','randomInt','isStateAffected','textSizeEx','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20visible\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20visible;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','setItem','TurnFontSize','Game_BattlerBase_increaseBuff','ConvertParams','CalcJS','frameCount','MatchLabelGaugeColor','mainAreaHeight','Scene_Battle_onSkillOk_Toggle','helpWindowRect','Game_BattlerBase_buffIconIndex','onAddStateMakeCustomSlipValues','ARRAYSTRUCT','Skill-%1-%2','commandStyleCheck','getStypeIdWithName','autoRemovalTiming','AGI','_cache_getPassiveStatesFromObj','some','<actor-%1>','_checkingPassiveStates','State-%1-%2','stateId','Settings','_scene','ParseStateNotetags','test','groupDefeat','buffColor','enemyId','center','miasmaStateIDs','LearnedMatrix','categories','Game_BattlerBase_resetStateCounts','SkillMenuStatusRect','addPassiveStatesByNotetag','PresetLabelGaugeColor','redrawSkillsStatesCore','forgetSkill','drawItem','return\x200','getPassiveStatesFromObj','AvailableChainSkill','filter','ARRAYEVAL','checkCacheKey','VisuMZ_0_CoreEngine','getSkillChangesFromState','Game_BattlerBase_skillMpCost','drawActorBuffTurns','NEGATIVE','AmplifyWith','allSwitchOn','damage','Game_BattlerBase_eraseBuff','528882TlsQpf','clamp','Sprite_Gauge_initMembers','onChange','iconText','getColorDataFromPluginParameters','Toggles','slipTp','LabelFontMainType','SkillSceneAdjustSkillList','endAction','defaultToggleSkillSetting','onExpireStateCustomJS','buffIconIndex','_shopStatusWindow','Window_Base_createAllSkillCostText_Toggle','gaugeColor1','CheckVisibleSwitchNotetags','convertTargetToStateOriginKey','checkShowHideNotetags','isCommandEnabled','getCurrentStateActiveUser','_bypassRemoveStateDamage_action','bypassRemoveStatesByDamage','helpWindowRectSkillsStatesCore','7050540DprORZ','EnemyIndex','alterSkillName','onExpireBuffGlobalJS','ActorIDs','currentDisplayedValue','updateFrame','updateStatesActionEnd','subject','_tempActor','removeByDamage','Game_BattlerBase_die','toggleOff','slice','_hidden','usableSkills','replace','Game_Player_refresh','splice','getStateOriginByKey','attacker','setStateOrigin','includesSkillsStatesCore','shift','drawText','push','skillCostSeparator','VisuMZ_3_FieldSkills','success','ColorBuff','onRemoveState','isSkillUsableForAutoBattle','currentClass','gaugeBackColor','refresh','isRightInputMode','Game_BattlerBase_refresh','_itemWindow','ParseSkillNotetags','CheckVisibleBattleNotetags','ParseSkillChangessIntoData','2010mCbGTK','getCurrentTroopUniqueID','addBuff','SkillsStatesCore','stateExpireJS','clearStates','25161435loidVx','_endingBattle','SkillID','indexOf','_stateRetainType','stateTurns','canClearState','Game_BattlerBase_meetsSkillConditions_Toggle','Window_SkillList_updateHelp','_stateDisplay','ATK','[OFF]','standardIconWidth','Game_Action_testApply','createKeyJS','multiclasses','fontBold','labelFontFace','stateEraseJS','_stateMaxTurns','onEraseDebuff','onAddBuffGlobalJS','clearAllStateOrigins','onAddBuff','greater','menuActor','ToggleOnTextColor','addChild','addDebuff','LabelOutlineWidth','skillTpCost','ItemConcoctSkills','_categoryWindow','Game_Battler_onBattleEnd','mpCost','ShowShopStatus','user','getStateIdWithName','GaugeDrawJS','slipHp','normalColor','enemy','process_VisuMZ_SkillsStatesCore_Notetags','drawTextEx','add','totalStateCategory','battleMembers','mpDamage','Armor-%1-%2','adjustItemWidthByShopStatus','isDebuffAffected','innerHeight','stateMpSlipDamageJS','resetTextColor','addPassiveStates','LearnedChainSkill','reset','_currentActor','KnownList','_buffs','drawSkillCost','ActiveChainSkills','eraseState','setActor','currentMaxValueSkillsStatesCore','meetsSkillConditions','meetsSkillConditionsEnableJS','hasToggleSkillAntiCheck','Window_SkillType_initialize','Parse_Notetags_Skill_Sorting','ShowData','ColorDebuff','trim','getClassIdWithName','onEraseDebuffGlobalJS','lineHeight','704564ZYadEA','aliveMembers','initMembers','actions','<member-%1>','ForceListRange','Window_SkillList_maxCols','Game_BattlerBase_states','meetsPassiveStateConditions','debuffTurns','callUpdateHelp','setSkillToggle','none','constructor','MeetsAuraNoteConditions','colSpacing','eraseBuff','Toggle','Game_BattlerBase_skillTpCost','process_VisuMZ_SkillsStatesCore_Skill_Notetags','skillTypes','Game_Action_executeHpDamage_bypassStateDmgRemoval','_turnDisplaySprite','MeetsAuraObjConditions','addWindow','toUpperCase','clearStateRetainType','uiMenuStyle','isSkillTypeMatchForUse','skillId','createCommandNameWindow','useDigitGrouping','removeBuffsAuto','stepsForTurn','Name','shopStatusWindowRect','StackBuffMax','_cache_CheckBypassRemoveStatesByDamage','_cache_isToggleSkill','tpCost','prepareResetStateCounts','isStateRestrict','createAllSkillCostText','meetsPassiveStateConditionClasses','_tempBattler','ReapplyRules','removeOtherStatesOfSameCategory','GaugeMaxJS','checkSkillConditionsSwitchNotetags','onItemOk','_stypeIDs','multiClass','Skills','Scene_Skill_statusWindowRect','min','death','VisuMZ_3_EvoMatrixSkills','MultiplierJS','BattleHiddenSkillTypes','friendsUnit','_actor','Parse_Notetags_State_SlipEffectJS','applyDebuffTurnManipulationEffects','Game_BattlerBase_meetsSkillConditions','equips','buffLength','inBattle','restriction','clearStatesWithStateRetain','ColorPositive','onAddDebuffGlobalJS','shopStatusWidth','statusWindowRectSkillsStatesCore','clearStateData','members','Game_Unit_deadMembers','iconWidth','changeSkillsThroughStateEffects','isAutoBattle','onEraseStateCustomJS','match','allBattleMembers','target','addPassiveStatesByPluginParameters','_costSettings','MDF','includes','VisuMZ_1_ElementStatusCore','onExpireDebuff','Param','buff','isPlaytest','Window_SkillList_drawItem','[ON]','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20condition\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20condition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','debuffColor','statusWindowRect','Scene_Skill_helpWindowRect','parse','textColor','createItemWindow','drawIcon','Game_BattlerBase_traitsSet','removeStatesByCategoryAll','Scene_Skill_onItemOk_Toggle','itemWindowRectSkillsStatesCore','value','text','onAddStateCustomJS','outlineColor','max','commandNameWindowDrawBackground','labelOutlineColor','onExpireBuffJS','traitsSet','ColorNeutral','updatedLayoutStyle','itemAt'];_0x4c9b=function(){return _0x484931;};return _0x4c9b();}const _0x2a62ce=_0x2bce;(function(_0x146604,_0xcccbfb){const _0x467f6f=_0x2bce,_0x4ff7e2=_0x146604();while(!![]){try{const _0x1e10cd=-parseInt(_0x467f6f(0x1cd))/0x1+parseInt(_0x467f6f(0x2e0))/0x2+-parseInt(_0x467f6f(0x28e))/0x3*(parseInt(_0x467f6f(0xbc))/0x4)+-parseInt(_0x467f6f(0x1bd))/0x5*(-parseInt(_0x467f6f(0x24c))/0x6)+-parseInt(_0x467f6f(0x265))/0x7+-parseInt(_0x467f6f(0x13c))/0x8+parseInt(_0x467f6f(0x294))/0x9;if(_0x1e10cd===_0xcccbfb)break;else _0x4ff7e2['push'](_0x4ff7e2['shift']());}catch(_0xee4bdf){_0x4ff7e2['push'](_0x4ff7e2['shift']());}}}(_0x4c9b,0xaf3d1));function _0x2bce(_0x11e36c,_0x5f5987){const _0x4c9b76=_0x4c9b();return _0x2bce=function(_0x2bce61,_0x19aaca){_0x2bce61=_0x2bce61-0xae;let _0x24efb6=_0x4c9b76[_0x2bce61];return _0x24efb6;},_0x2bce(_0x11e36c,_0x5f5987);}var label=_0x2a62ce(0x291),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x2a62ce(0x240)](function(_0x2b7809){const _0x3ea7e4=_0x2a62ce;return _0x2b7809[_0x3ea7e4(0x11e)]&&_0x2b7809['description'][_0x3ea7e4(0x336)]('['+label+']');})[0x0];VisuMZ[label][_0x2a62ce(0x22b)]=VisuMZ[label][_0x2a62ce(0x22b)]||{},VisuMZ[_0x2a62ce(0x216)]=function(_0x25412f,_0xb7afa2){const _0x3ff8d2=_0x2a62ce;for(const _0x3badaa in _0xb7afa2){if(_0x3badaa[_0x3ff8d2(0x330)](/(.*):(.*)/i)){const _0x5d1aed=String(RegExp['$1']),_0x29ec10=String(RegExp['$2'])['toUpperCase']()[_0x3ff8d2(0x2dc)]();let _0x5c4202,_0x341067,_0x12082d;switch(_0x29ec10){case'NUM':_0x5c4202=_0xb7afa2[_0x3badaa]!==''?Number(_0xb7afa2[_0x3badaa]):0x0;break;case _0x3ff8d2(0x1bb):_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067[_0x3ff8d2(0xcf)](_0x16921d=>Number(_0x16921d));break;case'EVAL':_0x5c4202=_0xb7afa2[_0x3badaa]!==''?eval(_0xb7afa2[_0x3badaa]):null;break;case _0x3ff8d2(0x241):_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067['map'](_0x4898de=>eval(_0x4898de));break;case _0x3ff8d2(0x380):_0x5c4202=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):'';break;case _0x3ff8d2(0x144):_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067[_0x3ff8d2(0xcf)](_0x4e5a24=>JSON['parse'](_0x4e5a24));break;case'FUNC':_0x5c4202=_0xb7afa2[_0x3badaa]!==''?new Function(JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa])):new Function(_0x3ff8d2(0x23d));break;case _0x3ff8d2(0x1e4):_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067[_0x3ff8d2(0xcf)](_0x44af71=>new Function(JSON['parse'](_0x44af71)));break;case'STR':_0x5c4202=_0xb7afa2[_0x3badaa]!==''?String(_0xb7afa2[_0x3badaa]):'';break;case'ARRAYSTR':_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067['map'](_0x2a4a02=>String(_0x2a4a02));break;case _0x3ff8d2(0xf8):_0x12082d=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):{},_0x25412f[_0x5d1aed]={},VisuMZ[_0x3ff8d2(0x216)](_0x25412f[_0x5d1aed],_0x12082d);continue;case _0x3ff8d2(0x21f):_0x341067=_0xb7afa2[_0x3badaa]!==''?JSON[_0x3ff8d2(0x342)](_0xb7afa2[_0x3badaa]):[],_0x5c4202=_0x341067['map'](_0x35b288=>VisuMZ[_0x3ff8d2(0x216)]({},JSON[_0x3ff8d2(0x342)](_0x35b288)));break;default:continue;}_0x25412f[_0x5d1aed]=_0x5c4202;}}return _0x25412f;},(_0x11dc47=>{const _0x4c761c=_0x2a62ce,_0x5cf6d5=_0x11dc47['name'];for(const _0xaba795 of dependencies){if(!Imported[_0xaba795]){alert(_0x4c761c(0x1b0)['format'](_0x5cf6d5,_0xaba795)),SceneManager[_0x4c761c(0x1c3)]();break;}}const _0x26b74c=_0x11dc47[_0x4c761c(0x1b4)];if(_0x26b74c['match'](/\[Version[ ](.*?)\]/i)){const _0x2801f2=Number(RegExp['$1']);_0x2801f2!==VisuMZ[label][_0x4c761c(0x15c)]&&(alert(_0x4c761c(0x202)['format'](_0x5cf6d5,_0x2801f2)),SceneManager[_0x4c761c(0x1c3)]());}if(_0x26b74c['match'](/\[Tier[ ](\d+)\]/i)){const _0x2d9fc4=Number(RegExp['$1']);_0x2d9fc4<tier?(alert(_0x4c761c(0x1a6)[_0x4c761c(0x1dc)](_0x5cf6d5,_0x2d9fc4,tier)),SceneManager['exit']()):tier=Math[_0x4c761c(0x34e)](_0x2d9fc4,tier);}VisuMZ[_0x4c761c(0x216)](VisuMZ[label][_0x4c761c(0x22b)],_0x11dc47['parameters']);})(pluginData),PluginManager[_0x2a62ce(0xe8)](pluginData['name'],_0x2a62ce(0x201),_0x535353=>{const _0x3be853=_0x2a62ce;VisuMZ[_0x3be853(0x216)](_0x535353,_0x535353);const _0x287e1a=_0x535353[_0x3be853(0x269)]||[],_0x554651=Number(_0x535353[_0x3be853(0x296)]),_0x340320=$dataSkills[_0x554651];if(!_0x340320)return;for(const _0xf39384 of _0x287e1a){const _0x3b27be=$gameActors[_0x3be853(0x1a3)](_0xf39384);if(!_0x3b27be)continue;_0x3b27be[_0x3be853(0x37c)](_0x340320);}}),PluginManager[_0x2a62ce(0xe8)](pluginData[_0x2a62ce(0x1f2)],_0x2a62ce(0x17e),_0x76ef4a=>{const _0x5379a2=_0x2a62ce;VisuMZ['ConvertParams'](_0x76ef4a,_0x76ef4a);const _0x443b31=_0x76ef4a[_0x5379a2(0x266)]||[],_0xd1f8e8=Number(_0x76ef4a['SkillID']),_0x5dbac0=$dataSkills[_0xd1f8e8];if(!_0x5dbac0)return;for(const _0x1f57e8 of _0x443b31){const _0x208719=$gameTroop['members']()[_0x1f57e8];if(!_0x208719)continue;_0x208719[_0x5379a2(0x37c)](_0x5dbac0);}}),PluginManager[_0x2a62ce(0xe8)](pluginData[_0x2a62ce(0x1f2)],_0x2a62ce(0x199),_0xc23712=>{const _0x2c4fec=_0x2a62ce;VisuMZ[_0x2c4fec(0x216)](_0xc23712,_0xc23712);const _0x343b89=_0xc23712['ActorIDs']||[],_0x5063c0=Number(_0xc23712[_0x2c4fec(0x1f8)]),_0x217203=Number(_0xc23712[_0x2c4fec(0x1f6)]),_0x35f211=_0xc23712[_0x2c4fec(0x16d)];for(const _0x290964 of _0x343b89){const _0x31ee84=$gameActors['actor'](_0x290964);if(!_0x31ee84)continue;_0x35f211&&!_0x31ee84[_0x2c4fec(0x210)](_0x5063c0)?(_0x31ee84[_0x2c4fec(0x1da)](_0x5063c0),_0x31ee84['setStateTurns'](_0x5063c0,_0x217203)):_0x31ee84[_0x2c4fec(0x3b7)](_0x5063c0,_0x217203);}}),PluginManager[_0x2a62ce(0xe8)](pluginData[_0x2a62ce(0x1f2)],'StateTurnsActorChangeTo',_0x506c05=>{const _0xda2621=_0x2a62ce;VisuMZ[_0xda2621(0x216)](_0x506c05,_0x506c05);const _0x1ddca3=_0x506c05[_0xda2621(0x269)]||[],_0x5a20e7=Number(_0x506c05['StateID']),_0x2fab6d=Math[_0xda2621(0x34e)](Number(_0x506c05[_0xda2621(0x1f6)]),0x0),_0x3277d4=_0x506c05[_0xda2621(0x16d)];for(const _0x22ebcb of _0x1ddca3){const _0x506fd5=$gameActors[_0xda2621(0x1a3)](_0x22ebcb);if(!_0x506fd5)continue;_0x3277d4&&!_0x506fd5[_0xda2621(0x210)](_0x5a20e7)&&_0x506fd5[_0xda2621(0x1da)](_0x5a20e7),_0x506fd5[_0xda2621(0x184)](_0x5a20e7,_0x2fab6d);}}),PluginManager[_0x2a62ce(0xe8)](pluginData[_0x2a62ce(0x1f2)],_0x2a62ce(0xfb),_0x3802bc=>{const _0x9e117f=_0x2a62ce;if(!$gameParty[_0x9e117f(0x322)]())return;VisuMZ[_0x9e117f(0x216)](_0x3802bc,_0x3802bc);const _0x310c86=_0x3802bc[_0x9e117f(0x266)]||[],_0x5c4adc=Number(_0x3802bc['StateID']),_0xeb75c=Number(_0x3802bc[_0x9e117f(0x1f6)]),_0x50c914=_0x3802bc[_0x9e117f(0x16d)];for(const _0x13bb57 of _0x310c86){const _0x5dc2b1=$gameTroop['members']()[_0x13bb57];if(!_0x5dc2b1)continue;_0x50c914&&!_0x5dc2b1['isStateAffected'](_0x5c4adc)?(_0x5dc2b1[_0x9e117f(0x1da)](_0x5c4adc),_0x5dc2b1[_0x9e117f(0x184)](_0x5c4adc,_0xeb75c)):_0x5dc2b1[_0x9e117f(0x3b7)](_0x5c4adc,_0xeb75c);}}),PluginManager[_0x2a62ce(0xe8)](pluginData[_0x2a62ce(0x1f2)],_0x2a62ce(0xe9),_0x1fdfed=>{const _0xe1faa6=_0x2a62ce;if(!$gameParty['inBattle']())return;VisuMZ['ConvertParams'](_0x1fdfed,_0x1fdfed);const _0x58eecf=_0x1fdfed[_0xe1faa6(0x266)]||[],_0x26d585=Number(_0x1fdfed[_0xe1faa6(0x1f8)]),_0x47bc7d=Math[_0xe1faa6(0x34e)](Number(_0x1fdfed[_0xe1faa6(0x1f6)]),0x0),_0x4eb401=_0x1fdfed[_0xe1faa6(0x16d)];for(const _0x944d69 of _0x58eecf){const _0x1e7904=$gameTroop['members']()[_0x944d69];if(!_0x1e7904)continue;_0x4eb401&&!_0x1e7904[_0xe1faa6(0x210)](_0x26d585)&&_0x1e7904[_0xe1faa6(0x1da)](_0x26d585),_0x1e7904[_0xe1faa6(0x184)](_0x26d585,_0x47bc7d);}}),VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x18a)]=Scene_Boot[_0x2a62ce(0x151)][_0x2a62ce(0x3b3)],Scene_Boot['prototype']['onDatabaseLoaded']=function(){const _0x551e33=_0x2a62ce;VisuMZ[_0x551e33(0x291)][_0x551e33(0x18a)][_0x551e33(0x107)](this),this[_0x551e33(0x2be)](),VisuMZ[_0x551e33(0x291)]['CheckIncompatibleStates']();},Scene_Boot[_0x2a62ce(0x151)][_0x2a62ce(0x2be)]=function(){const _0x15a82c=_0x2a62ce;this[_0x15a82c(0x13b)]();if(VisuMZ[_0x15a82c(0xf1)])return;this[_0x15a82c(0x2f3)](),this[_0x15a82c(0x20a)]();},Scene_Boot[_0x2a62ce(0x151)][_0x2a62ce(0x2f3)]=function(){const _0x4bc984=_0x2a62ce;for(const _0x57a9ed of $dataSkills){if(!_0x57a9ed)continue;VisuMZ[_0x4bc984(0x291)]['Parse_Notetags_Skill_Cost'](_0x57a9ed),VisuMZ['SkillsStatesCore'][_0x4bc984(0x2d9)](_0x57a9ed),VisuMZ['SkillsStatesCore'][_0x4bc984(0x117)](_0x57a9ed);}},Scene_Boot[_0x2a62ce(0x151)][_0x2a62ce(0x20a)]=function(){const _0x4cc13e=_0x2a62ce;for(const _0x815842 of $dataStates){if(!_0x815842)continue;VisuMZ[_0x4cc13e(0x291)]['Parse_Notetags_State_Category'](_0x815842),VisuMZ['SkillsStatesCore'][_0x4cc13e(0xeb)](_0x815842),VisuMZ[_0x4cc13e(0x291)][_0x4cc13e(0x31d)](_0x815842),VisuMZ[_0x4cc13e(0x291)][_0x4cc13e(0x382)](_0x815842);}},VisuMZ['SkillsStatesCore']['ParseSkillNotetags']=VisuMZ['ParseSkillNotetags'],VisuMZ['ParseSkillNotetags']=function(_0xd77796){const _0x2d4e0d=_0x2a62ce;VisuMZ[_0x2d4e0d(0x291)][_0x2d4e0d(0x28b)]['call'](this,_0xd77796),VisuMZ[_0x2d4e0d(0x291)]['Parse_Notetags_Skill_Cost'](_0xd77796),VisuMZ['SkillsStatesCore'][_0x2d4e0d(0x2d9)](_0xd77796),VisuMZ[_0x2d4e0d(0x291)][_0x2d4e0d(0x117)](_0xd77796);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x22d)]=VisuMZ['ParseStateNotetags'],VisuMZ['ParseStateNotetags']=function(_0x2fb6b9){const _0x1acafa=_0x2a62ce;VisuMZ[_0x1acafa(0x291)][_0x1acafa(0x22d)][_0x1acafa(0x107)](this,_0x2fb6b9),VisuMZ['SkillsStatesCore']['Parse_Notetags_State_Category'](_0x2fb6b9),VisuMZ['SkillsStatesCore']['Parse_Notetags_State_PassiveJS'](_0x2fb6b9),VisuMZ[_0x1acafa(0x291)]['Parse_Notetags_State_SlipEffectJS'](_0x2fb6b9),VisuMZ[_0x1acafa(0x291)][_0x1acafa(0x382)](_0x2fb6b9);},VisuMZ[_0x2a62ce(0x291)]['Parse_Notetags_Skill_Cost']=function(_0x4c9ec0){const _0x42ea54=_0x2a62ce,_0x401e10=_0x4c9ec0[_0x42ea54(0x12a)];_0x401e10[_0x42ea54(0x330)](/<MP COST:[ ](\d+)>/i)&&(_0x4c9ec0[_0x42ea54(0x2b6)]=Number(RegExp['$1'])),_0x401e10[_0x42ea54(0x330)](/<TP COST:[ ](\d+)>/i)&&(_0x4c9ec0[_0x42ea54(0x307)]=Number(RegExp['$1']));},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2d9)]=function(_0x5cce34){const _0x34f5e1=_0x2a62ce;if(!_0x5cce34)return;_0x5cce34[_0x34f5e1(0x153)]=0x32;const _0x149844=_0x5cce34[_0x34f5e1(0x12a)]||'';_0x149844[_0x34f5e1(0x330)](/<(?:|ID )SORT(?:|ING)[ ]PRIORITY:[ ](\d+)>/i)&&(_0x5cce34[_0x34f5e1(0x153)]=Number(RegExp['$1']));},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x100)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x1db)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x117)]=function(_0x1f1070){const _0x141b7a=_0x2a62ce,_0x11386c=_0x1f1070[_0x141b7a(0x12a)];if(_0x11386c['match'](/<JS SKILL ENABLE>\s*([\s\S]*)\s*<\/JS SKILL ENABLE>/i)){const _0x20816a=String(RegExp['$1']),_0x41c369='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20enabled\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20enabled;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'[_0x141b7a(0x1dc)](_0x20816a);VisuMZ[_0x141b7a(0x291)][_0x141b7a(0x100)][_0x1f1070['id']]=new Function(_0x141b7a(0x176),_0x41c369);}if(_0x11386c['match'](/<JS SKILL VISIBLE>\s*([\s\S]*)\s*<\/JS SKILL VISIBLE>/i)){const _0x231c1e=String(RegExp['$1']),_0x4cc685=_0x141b7a(0x212)[_0x141b7a(0x1dc)](_0x231c1e);VisuMZ[_0x141b7a(0x291)][_0x141b7a(0x1db)][_0x1f1070['id']]=new Function('skill',_0x4cc685);}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x103)]=function(_0x2e8de9){const _0x47c41e=_0x2a62ce;_0x2e8de9[_0x47c41e(0x235)]=[_0x47c41e(0xbd),'ANY'];const _0x507a75=_0x2e8de9[_0x47c41e(0x12a)],_0xb7c3dd=_0x507a75[_0x47c41e(0x330)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);if(_0xb7c3dd)for(const _0x575ff7 of _0xb7c3dd){_0x575ff7[_0x47c41e(0x330)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);const _0x2bbb89=String(RegExp['$1'])['toUpperCase']()[_0x47c41e(0x2dc)]()[_0x47c41e(0x181)](',');for(const _0x4c3f58 of _0x2bbb89){_0x2e8de9[_0x47c41e(0x235)][_0x47c41e(0x27e)](_0x4c3f58[_0x47c41e(0x2dc)]());}}if(_0x507a75['match'](/<(?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/(?:CATEGORY|CATEGORIES)>/i)){const _0xc29f27=RegExp['$1']['split'](/[\r\n]+/);for(const _0x7228ac of _0xc29f27){_0x2e8de9[_0x47c41e(0x235)][_0x47c41e(0x27e)](_0x7228ac[_0x47c41e(0x2f9)]()['trim']());}}_0x507a75['match'](/<POSITIVE STATE>/i)&&_0x2e8de9['categories'][_0x47c41e(0x27e)]('POSITIVE'),_0x507a75[_0x47c41e(0x330)](/<NEGATIVE STATE>/i)&&_0x2e8de9[_0x47c41e(0x235)][_0x47c41e(0x27e)](_0x47c41e(0x247));},VisuMZ[_0x2a62ce(0x291)]['statePassiveConditionJS']={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xeb)]=function(_0x52ffb8){const _0x42680f=_0x2a62ce,_0x4d4fff=_0x52ffb8['note'];if(_0x4d4fff[_0x42680f(0x330)](/<JS PASSIVE CONDITION>\s*([\s\S]*)\s*<\/JS PASSIVE CONDITION>/i)){const _0x56a613=String(RegExp['$1']),_0x1a3736=_0x42680f(0x33e)[_0x42680f(0x1dc)](_0x56a613);VisuMZ['SkillsStatesCore'][_0x42680f(0x1ce)][_0x52ffb8['id']]=new Function('state',_0x1a3736);}},VisuMZ[_0x2a62ce(0x291)]['stateHpSlipDamageJS']={},VisuMZ[_0x2a62ce(0x291)]['stateHpSlipHealJS']={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2c8)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3ae)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x10b)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xbf)]={},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x31d)]=function(_0x463fdf){const _0x406a22=_0x2a62ce,_0x3a7e37=_0x463fdf[_0x406a22(0x12a)],_0x8462dc=_0x406a22(0x1e7);if(_0x3a7e37[_0x406a22(0x330)](/<JS HP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS HP SLIP DAMAGE>/i)){const _0x4b531d=String(RegExp['$1']),_0x11b75b=_0x8462dc['format'](_0x4b531d,'damage',-0x1,_0x406a22(0x2bb));VisuMZ[_0x406a22(0x291)][_0x406a22(0x1df)][_0x463fdf['id']]=new Function(_0x406a22(0x22a),_0x11b75b);}else{if(_0x3a7e37['match'](/<JS HP SLIP HEAL>\s*([\s\S]*)\s*<\/JS HP SLIP HEAL>/i)){const _0x591b9d=String(RegExp['$1']),_0x532c2a=_0x8462dc['format'](_0x591b9d,_0x406a22(0x203),0x1,_0x406a22(0x2bb));VisuMZ[_0x406a22(0x291)][_0x406a22(0x158)][_0x463fdf['id']]=new Function(_0x406a22(0x22a),_0x532c2a);}}if(_0x3a7e37[_0x406a22(0x330)](/<JS MP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS MP SLIP DAMAGE>/i)){const _0x596699=String(RegExp['$1']),_0x5bb828=_0x8462dc['format'](_0x596699,_0x406a22(0x24a),-0x1,_0x406a22(0x137));VisuMZ[_0x406a22(0x291)]['stateMpSlipDamageJS'][_0x463fdf['id']]=new Function(_0x406a22(0x22a),_0x5bb828);}else{if(_0x3a7e37[_0x406a22(0x330)](/<JS MP SLIP HEAL>\s*([\s\S]*)\s*<\/JS MP SLIP HEAL>/i)){const _0x5a2109=String(RegExp['$1']),_0x4d895f=_0x8462dc['format'](_0x5a2109,_0x406a22(0x203),0x1,_0x406a22(0x137));VisuMZ[_0x406a22(0x291)][_0x406a22(0x3ae)][_0x463fdf['id']]=new Function('stateId',_0x4d895f);}}if(_0x3a7e37[_0x406a22(0x330)](/<JS TP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS TP SLIP DAMAGE>/i)){const _0x428ac0=String(RegExp['$1']),_0x4c7e91=_0x8462dc[_0x406a22(0x1dc)](_0x428ac0,_0x406a22(0x24a),-0x1,_0x406a22(0x253));VisuMZ['SkillsStatesCore'][_0x406a22(0x10b)][_0x463fdf['id']]=new Function(_0x406a22(0x22a),_0x4c7e91);}else{if(_0x3a7e37[_0x406a22(0x330)](/<JS TP SLIP HEAL>\s*([\s\S]*)\s*<\/JS TP SLIP HEAL>/i)){const _0x1cede8=String(RegExp['$1']),_0xa0efee=_0x8462dc['format'](_0x1cede8,'heal',0x1,'slipTp');VisuMZ[_0x406a22(0x291)][_0x406a22(0xbf)][_0x463fdf['id']]=new Function(_0x406a22(0x22a),_0xa0efee);}}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3bd)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2a6)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x292)]={},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x382)]=function(_0x45381e){const _0x5a6d55=_0x2a62ce,_0xe6430e=_0x45381e['note'],_0xe85bf4='\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this.getCurrentStateActiveUser();\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20';if(_0xe6430e[_0x5a6d55(0x330)](/<JS ON ADD STATE>\s*([\s\S]*)\s*<\/JS ON ADD STATE>/i)){const _0xa9d54e=String(RegExp['$1']),_0x5bdaf7=_0xe85bf4[_0x5a6d55(0x1dc)](_0xa9d54e);VisuMZ[_0x5a6d55(0x291)][_0x5a6d55(0x3bd)][_0x45381e['id']]=new Function('stateId',_0x5bdaf7);}if(_0xe6430e[_0x5a6d55(0x330)](/<JS ON ERASE STATE>\s*([\s\S]*)\s*<\/JS ON ERASE STATE>/i)){const _0x79ffb=String(RegExp['$1']),_0xc233fb=_0xe85bf4['format'](_0x79ffb);VisuMZ[_0x5a6d55(0x291)][_0x5a6d55(0x2a6)][_0x45381e['id']]=new Function('stateId',_0xc233fb);}if(_0xe6430e[_0x5a6d55(0x330)](/<JS ON EXPIRE STATE>\s*([\s\S]*)\s*<\/JS ON EXPIRE STATE>/i)){const _0x3830d2=String(RegExp['$1']),_0x58f95a=_0xe85bf4[_0x5a6d55(0x1dc)](_0x3830d2);VisuMZ[_0x5a6d55(0x291)]['stateExpireJS'][_0x45381e['id']]=new Function(_0x5a6d55(0x22a),_0x58f95a);}},VisuMZ[_0x2a62ce(0x291)]['CheckIncompatibleStates']=function(){const _0x2221ac=_0x2a62ce;if(!VisuMZ['SkillsStatesCore'][_0x2221ac(0x22b)][_0x2221ac(0x39a)]['ActionEndUpdate'])return;for(const _0x4393d1 of $dataStates){if(!_0x4393d1)continue;_0x4393d1[_0x2221ac(0x323)]===0x4&&_0x4393d1['autoRemovalTiming']===0x1&&(_0x4393d1['autoRemovalTiming']=0x2);}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2a2)]=function(_0x4da999,_0x3e62e1){const _0x3a9d8e=_0x2a62ce;if(VisuMZ['createKeyJS'])return VisuMZ['createKeyJS'](_0x4da999,_0x3e62e1);let _0x58988e='';if($dataActors[_0x3a9d8e(0x336)](_0x4da999))_0x58988e='Actor-%1-%2'['format'](_0x4da999['id'],_0x3e62e1);if($dataClasses[_0x3a9d8e(0x336)](_0x4da999))_0x58988e='Class-%1-%2'['format'](_0x4da999['id'],_0x3e62e1);if($dataSkills[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0x220)['format'](_0x4da999['id'],_0x3e62e1);if($dataItems[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0x182)[_0x3a9d8e(0x1dc)](_0x4da999['id'],_0x3e62e1);if($dataWeapons[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0x14a)[_0x3a9d8e(0x1dc)](_0x4da999['id'],_0x3e62e1);if($dataArmors[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0x2c4)[_0x3a9d8e(0x1dc)](_0x4da999['id'],_0x3e62e1);if($dataEnemies[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0xc1)[_0x3a9d8e(0x1dc)](_0x4da999['id'],_0x3e62e1);if($dataStates[_0x3a9d8e(0x336)](_0x4da999))_0x58988e=_0x3a9d8e(0x229)[_0x3a9d8e(0x1dc)](_0x4da999['id'],_0x3e62e1);return _0x58988e;},DataManager[_0x2a62ce(0x2dd)]=function(_0x31cbfa){const _0x4d6a46=_0x2a62ce;_0x31cbfa=_0x31cbfa['toUpperCase']()['trim'](),this['_classIDs']=this[_0x4d6a46(0xd2)]||{};if(this['_classIDs'][_0x31cbfa])return this[_0x4d6a46(0xd2)][_0x31cbfa];for(const _0x15b42d of $dataClasses){if(!_0x15b42d)continue;let _0x4e1a44=_0x15b42d[_0x4d6a46(0x1f2)];_0x4e1a44=_0x4e1a44[_0x4d6a46(0x275)](/\x1I\[(\d+)\]/gi,''),_0x4e1a44=_0x4e1a44[_0x4d6a46(0x275)](/\\I\[(\d+)\]/gi,''),this[_0x4d6a46(0xd2)][_0x4e1a44[_0x4d6a46(0x2f9)]()['trim']()]=_0x15b42d['id'];}return this['_classIDs'][_0x31cbfa]||0x0;},DataManager[_0x2a62ce(0x1d3)]=function(_0x4f2a9e){const _0x291b04=_0x2a62ce;this[_0x291b04(0x312)]=this[_0x291b04(0x312)]||{};if(this[_0x291b04(0x312)][_0x4f2a9e['id']])return this[_0x291b04(0x312)][_0x4f2a9e['id']];this[_0x291b04(0x312)][_0x4f2a9e['id']]=[_0x4f2a9e['stypeId']];if(_0x4f2a9e[_0x291b04(0x12a)][_0x291b04(0x330)](/<SKILL[ ](?:TYPE|TYPES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5351fb=JSON['parse']('['+RegExp['$1'][_0x291b04(0x330)](/\d+/g)+']');this[_0x291b04(0x312)][_0x4f2a9e['id']]=this[_0x291b04(0x312)][_0x4f2a9e['id']][_0x291b04(0x114)](_0x5351fb);}else{if(_0x4f2a9e['note'][_0x291b04(0x330)](/<SKILL[ ](?:TYPE|TYPES):[ ](.*)>/i)){const _0x4b1cc2=RegExp['$1'][_0x291b04(0x181)](',');for(const _0x10b728 of _0x4b1cc2){const _0x55a699=DataManager[_0x291b04(0x222)](_0x10b728);if(_0x55a699)this[_0x291b04(0x312)][_0x4f2a9e['id']][_0x291b04(0x27e)](_0x55a699);}}}return this['_stypeIDs'][_0x4f2a9e['id']];},DataManager['getStypeIdWithName']=function(_0x18ea97){const _0x355131=_0x2a62ce;_0x18ea97=_0x18ea97[_0x355131(0x2f9)]()['trim'](),this['_stypeIDs']=this['_stypeIDs']||{};if(this[_0x355131(0x312)][_0x18ea97])return this[_0x355131(0x312)][_0x18ea97];for(let _0x1a4f8a=0x1;_0x1a4f8a<0x64;_0x1a4f8a++){if(!$dataSystem[_0x355131(0x2f4)][_0x1a4f8a])continue;let _0x3b24c1=$dataSystem[_0x355131(0x2f4)][_0x1a4f8a][_0x355131(0x2f9)]()[_0x355131(0x2dc)]();_0x3b24c1=_0x3b24c1['replace'](/\x1I\[(\d+)\]/gi,''),_0x3b24c1=_0x3b24c1[_0x355131(0x275)](/\\I\[(\d+)\]/gi,''),this[_0x355131(0x312)][_0x3b24c1]=_0x1a4f8a;}return this['_stypeIDs'][_0x18ea97]||0x0;},DataManager[_0x2a62ce(0x186)]=function(_0x49e79d){const _0x264b49=_0x2a62ce;_0x49e79d=_0x49e79d[_0x264b49(0x2f9)]()[_0x264b49(0x2dc)](),this[_0x264b49(0x1ad)]=this['_skillIDs']||{};if(this[_0x264b49(0x1ad)][_0x49e79d])return this['_skillIDs'][_0x49e79d];for(const _0x3521a9 of $dataSkills){if(!_0x3521a9)continue;this['_skillIDs'][_0x3521a9[_0x264b49(0x1f2)][_0x264b49(0x2f9)]()[_0x264b49(0x2dc)]()]=_0x3521a9['id'];}return this['_skillIDs'][_0x49e79d]||0x0;},DataManager[_0x2a62ce(0x2b9)]=function(_0x56be6d){const _0x1be2c8=_0x2a62ce;_0x56be6d=_0x56be6d[_0x1be2c8(0x2f9)]()[_0x1be2c8(0x2dc)](),this['_stateIDs']=this[_0x1be2c8(0xdc)]||{};if(this[_0x1be2c8(0xdc)][_0x56be6d])return this[_0x1be2c8(0xdc)][_0x56be6d];for(const _0x105193 of $dataStates){if(!_0x105193)continue;this[_0x1be2c8(0xdc)][_0x105193[_0x1be2c8(0x1f2)][_0x1be2c8(0x2f9)]()[_0x1be2c8(0x2dc)]()]=_0x105193['id'];}return this[_0x1be2c8(0xdc)][_0x56be6d]||0x0;},DataManager[_0x2a62ce(0x19c)]=function(_0x1911dc){const _0x1d25dd=_0x2a62ce;this['_stateMaxTurns']=this[_0x1d25dd(0x2a7)]||{};if(this[_0x1d25dd(0x2a7)][_0x1911dc])return this[_0x1d25dd(0x2a7)][_0x1911dc];return $dataStates[_0x1911dc][_0x1d25dd(0x12a)][_0x1d25dd(0x330)](/<MAX TURNS:[ ](\d+)>/i)?this[_0x1d25dd(0x2a7)][_0x1911dc]=Number(RegExp['$1']):this[_0x1d25dd(0x2a7)][_0x1911dc]=VisuMZ[_0x1d25dd(0x291)]['Settings']['States'][_0x1d25dd(0x136)],this['_stateMaxTurns'][_0x1911dc];},DataManager[_0x2a62ce(0x244)]=function(_0x388a09){const _0x235012=_0x2a62ce;if(!_0x388a09)return{};this[_0x235012(0x20d)]=this[_0x235012(0x20d)]||{};if(this['_skillChangesFromState'][_0x388a09['id']]!==undefined)return this[_0x235012(0x20d)][_0x388a09['id']];const _0x14587a=_0x388a09[_0x235012(0x12a)]||'',_0x5d6bec={};{const _0x51f5b0=_0x14587a[_0x235012(0x330)](/<SKILL CHANGE(?:|S):[ ](.*)[ ]>>>[ ](.*)>/gi);if(_0x51f5b0)for(const _0x5020df of _0x51f5b0){_0x5020df[_0x235012(0x330)](/<SKILL CHANGE(?:|S):[ ](.*)[ ]>>>[ ](.*)>/gi);let _0x560f3f=String(RegExp['$1']),_0x5774d2=String(RegExp['$2']);VisuMZ[_0x235012(0x291)][_0x235012(0x28d)](_0x5d6bec,_0x560f3f,_0x5774d2);}}if(_0x14587a[_0x235012(0x330)](/<SKILL CHANGE(?:|S)>\s*([\s\S]*)\s*<\/SKILL CHANGE(?:|S)>/i)){const _0x423c4f=String(RegExp['$1'])[_0x235012(0x181)](/[\r\n]+/)[_0x235012(0x12b)]('');for(const _0x28fa69 of _0x423c4f){if(_0x28fa69[_0x235012(0x330)](/(.*)[ ]>>>[ ](.*)/i)){let _0x1e0c6c=String(RegExp['$1']),_0x496d39=String(RegExp['$2']);VisuMZ[_0x235012(0x291)]['ParseSkillChangessIntoData'](_0x5d6bec,_0x1e0c6c,_0x496d39);}}}return this[_0x235012(0x20d)][_0x388a09['id']]=_0x5d6bec,this['_skillChangesFromState'][_0x388a09['id']];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x28d)]=function(_0x5b1cb4,_0x4c8ad2,_0x421060){const _0x28b0a0=_0x2a62ce;/^\d+$/[_0x28b0a0(0x22e)](_0x4c8ad2)?_0x4c8ad2=Number(_0x4c8ad2):_0x4c8ad2=DataManager[_0x28b0a0(0x186)](_0x4c8ad2),/^\d+$/[_0x28b0a0(0x22e)](_0x421060)?_0x421060=Number(_0x421060):_0x421060=DataManager['getSkillIdWithName'](_0x421060),_0x5b1cb4[_0x4c8ad2]=_0x421060;},DataManager[_0x2a62ce(0x35a)]=function(_0x367d68){const _0x5dd4b0=_0x2a62ce;if(!DataManager['isSkill'](_0x367d68))return![];this[_0x5dd4b0(0x306)]=this['_cache_isToggleSkill']||{};if(this[_0x5dd4b0(0x306)][_0x367d68['id']]!==undefined)return this['_cache_isToggleSkill'][_0x367d68['id']];this[_0x5dd4b0(0x306)][_0x367d68['id']]=![];const _0x483644=_0x367d68[_0x5dd4b0(0x12a)]||'';if(_0x483644[_0x5dd4b0(0x330)](/<TOGGLE>/i))this[_0x5dd4b0(0x306)][_0x367d68['id']]=!![];else{if(_0x483644['match'](/<INITIAL TOGGLE: ON>/i))this[_0x5dd4b0(0x306)][_0x367d68['id']]=!![];else{if(_0x483644[_0x5dd4b0(0x330)](/<INITIAL TOGGLE: OFF>/i))this[_0x5dd4b0(0x306)][_0x367d68['id']]=!![];else _0x483644['match'](/<TOGGLE EXCLU(?:DE|SION) GROUP(?:|S):[ ](.*)>/i)&&(this[_0x5dd4b0(0x306)][_0x367d68['id']]=!![]);}}return this[_0x5dd4b0(0x2d7)](_0x483644)&&(this[_0x5dd4b0(0x306)][_0x367d68['id']]=![]),this[_0x5dd4b0(0x306)][_0x367d68['id']];},DataManager[_0x2a62ce(0x2d7)]=function(_0x59e1d4){const _0xa5f643=_0x2a62ce;if(Imported['VisuMZ_3_ActiveChainSkills']){const _0x1b5476=VisuMZ[_0xa5f643(0x2d1)]['RegExp'];if(_0x59e1d4[_0xa5f643(0x330)](_0x1b5476[_0xa5f643(0x23f)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x1b5476['ForcedChainSkill']))return!![];if(_0x59e1d4['match'](_0x1b5476[_0xa5f643(0x2cb)]))return!![];}if(Imported[_0xa5f643(0x318)]){const _0x5b8814=VisuMZ['EvoMatrixSkills'][_0xa5f643(0x1e9)];if(_0x59e1d4[_0xa5f643(0x330)](_0x5b8814[_0xa5f643(0x104)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x5b8814[_0xa5f643(0xb4)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x5b8814[_0xa5f643(0x234)]))return!![];}if(Imported['VisuMZ_3_InputComboSkills']){const _0x3db59f=VisuMZ[_0xa5f643(0x1aa)][_0xa5f643(0x1e9)];if(_0x59e1d4[_0xa5f643(0x330)](_0x3db59f[_0xa5f643(0x1ac)]))return!![];}if(Imported[_0xa5f643(0x280)]){const _0x5165ea=VisuMZ['FieldSkills'][_0xa5f643(0x1e9)];if(_0x59e1d4[_0xa5f643(0x330)](_0x5165ea[_0xa5f643(0x150)]))return!![];}if(Imported['VisuMZ_3_ItemAmplifySkills']){const _0x23c490=VisuMZ[_0xa5f643(0x388)][_0xa5f643(0x1e9)];if(_0x59e1d4['match'](_0x23c490[_0xa5f643(0x248)]))return!![];}if(Imported['VisuMZ_3_ItemConcoctSkills']){const _0xcb721=VisuMZ[_0xa5f643(0x2b3)][_0xa5f643(0x1e9)];if(_0x59e1d4[_0xa5f643(0x330)](_0xcb721[_0xa5f643(0x1c6)]))return!![];}if(Imported[_0xa5f643(0x36d)]){const _0x24335b=VisuMZ[_0xa5f643(0x18d)]['RegExp'];if(_0x59e1d4[_0xa5f643(0x330)](_0x24335b[_0xa5f643(0x179)]))return!![];}if(Imported['VisuMZ_4_SkillContainers']){const _0x1e4c7b=VisuMZ[_0xa5f643(0xf6)][_0xa5f643(0x1e9)];if(_0x59e1d4[_0xa5f643(0x330)](_0x1e4c7b[_0xa5f643(0x2ce)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x1e4c7b[_0xa5f643(0xe7)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x1e4c7b[_0xa5f643(0xfa)]))return!![];if(_0x59e1d4[_0xa5f643(0x330)](_0x1e4c7b[_0xa5f643(0x2e5)]))return!![];}return![];},DataManager[_0x2a62ce(0x257)]=function(_0x27c282){const _0x5a58d7=_0x2a62ce,_0x3dc371=_0x27c282?_0x27c282[_0x5a58d7(0x12a)]||'':'';if(_0x3dc371['match'](/<INITIAL TOGGLE: ON>/i))return!![];else{if(_0x3dc371[_0x5a58d7(0x330)](/<INITIAL TOGGLE: OFF>/i))return![];}return VisuMZ['SkillsStatesCore'][_0x5a58d7(0x22b)][_0x5a58d7(0x252)]['DefaultToggle'];},DataManager[_0x2a62ce(0x130)]=function(_0x5be888){const _0x58c156=_0x2a62ce;if(!this[_0x58c156(0x379)](_0x5be888))return[];this[_0x58c156(0x14e)]=this[_0x58c156(0x14e)]||{};if(this[_0x58c156(0x14e)][_0x5be888['id']]!==undefined)return this[_0x58c156(0x14e)][_0x5be888['id']];let _0xebfc47=[];const _0x49ce3c=_0x5be888['note']||'';return _0x49ce3c['match'](/<TOGGLE EXCLU(?:DE|SION) GROUP(?:|S):[ ](.*)>/i)&&(_0xebfc47=String(RegExp['$1'])['split'](',')[_0x58c156(0xcf)](_0xb75f4a=>_0xb75f4a[_0x58c156(0x2f9)]()[_0x58c156(0x2dc)]())),this[_0x58c156(0x14e)][_0x5be888['id']]=_0xebfc47,this['_cache_toggleExclusionGroups'][_0x5be888['id']];},TextManager['toggleType']=VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x22b)]['Toggles'][_0x2a62ce(0x1b8)]??_0x2a62ce(0x2f1),TextManager[_0x2a62ce(0x3cc)]=VisuMZ[_0x2a62ce(0x291)]['Settings'][_0x2a62ce(0x252)][_0x2a62ce(0x36b)]??_0x2a62ce(0xda),TextManager['toggleOff']=VisuMZ[_0x2a62ce(0x291)]['Settings']['Toggles'][_0x2a62ce(0xec)]??_0x2a62ce(0x10c),TextManager[_0x2a62ce(0x391)]=VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x22b)][_0x2a62ce(0x252)]['ToggleOffLocation']??_0x2a62ce(0x192),ColorManager[_0x2a62ce(0x251)]=function(_0x349dd1,_0x243bcd){const _0xc17785=_0x2a62ce;return _0x243bcd=String(_0x243bcd),this[_0xc17785(0x155)]=this[_0xc17785(0x155)]||{},_0x243bcd['match'](/#(.*)/i)?this['_colorCache'][_0x349dd1]=_0xc17785(0x1b2)[_0xc17785(0x1dc)](String(RegExp['$1'])):this[_0xc17785(0x155)][_0x349dd1]=this[_0xc17785(0x343)](Number(_0x243bcd)),this[_0xc17785(0x155)][_0x349dd1];},ColorManager['getColor']=function(_0x4504b7){const _0x28dc5b=_0x2a62ce;return _0x4504b7=String(_0x4504b7),_0x4504b7[_0x28dc5b(0x330)](/#(.*)/i)?_0x28dc5b(0x1b2)[_0x28dc5b(0x1dc)](String(RegExp['$1'])):this[_0x28dc5b(0x343)](Number(_0x4504b7));},ColorManager['stateColor']=function(_0x43fd37){const _0x4796a9=_0x2a62ce;if(typeof _0x43fd37===_0x4796a9(0x148))_0x43fd37=$dataStates[_0x43fd37];const _0x49955f=_0x4796a9(0x160)[_0x4796a9(0x1dc)](_0x43fd37['id']);this[_0x4796a9(0x155)]=this[_0x4796a9(0x155)]||{};if(this[_0x4796a9(0x155)][_0x49955f])return this[_0x4796a9(0x155)][_0x49955f];const _0x556194=this['retrieveStateColor'](_0x43fd37);return this['getColorDataFromPluginParameters'](_0x49955f,_0x556194);},ColorManager[_0x2a62ce(0x1d4)]=function(_0x486b5c){const _0x502029=_0x2a62ce,_0x2faeb8=_0x486b5c['note'];if(_0x2faeb8['match'](/<TURN COLOR:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x2faeb8[_0x502029(0x330)](/<POSITIVE STATE>/i))return VisuMZ[_0x502029(0x291)]['Settings'][_0x502029(0x39a)][_0x502029(0x325)];else return _0x2faeb8[_0x502029(0x330)](/<NEGATIVE STATE>/i)?VisuMZ[_0x502029(0x291)]['Settings'][_0x502029(0x39a)]['ColorNegative']:VisuMZ['SkillsStatesCore'][_0x502029(0x22b)][_0x502029(0x39a)][_0x502029(0x353)];}},ColorManager[_0x2a62ce(0x230)]=function(){const _0x385e3f=_0x2a62ce,_0x371f77='_stored_buffColor';this[_0x385e3f(0x155)]=this[_0x385e3f(0x155)]||{};if(this['_colorCache'][_0x371f77])return this['_colorCache'][_0x371f77];const _0x4b8373=VisuMZ['SkillsStatesCore'][_0x385e3f(0x22b)][_0x385e3f(0x14f)][_0x385e3f(0x282)];return this[_0x385e3f(0x251)](_0x371f77,_0x4b8373);},ColorManager[_0x2a62ce(0x33f)]=function(){const _0x3b71d1=_0x2a62ce,_0x2716df='_stored_debuffColor';this[_0x3b71d1(0x155)]=this[_0x3b71d1(0x155)]||{};if(this['_colorCache'][_0x2716df])return this[_0x3b71d1(0x155)][_0x2716df];const _0x747a46=VisuMZ[_0x3b71d1(0x291)][_0x3b71d1(0x22b)][_0x3b71d1(0x14f)][_0x3b71d1(0x2db)];return this['getColorDataFromPluginParameters'](_0x2716df,_0x747a46);},SceneManager['isSceneBattle']=function(){const _0x459fa0=_0x2a62ce;return this[_0x459fa0(0x22c)]&&this[_0x459fa0(0x22c)][_0x459fa0(0x2ed)]===Scene_Battle;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3a2)]=BattleManager[_0x2a62ce(0x256)],BattleManager['endAction']=function(){const _0x5f3f8e=_0x2a62ce;this[_0x5f3f8e(0x26c)](),VisuMZ[_0x5f3f8e(0x291)][_0x5f3f8e(0x3a2)][_0x5f3f8e(0x107)](this);},BattleManager[_0x2a62ce(0x26c)]=function(){const _0x6207e6=_0x2a62ce,_0x34e143=VisuMZ['SkillsStatesCore']['Settings']['States'];if(!_0x34e143)return;if(_0x34e143[_0x6207e6(0x374)]===![])return;if(!this['_subject'])return;this[_0x6207e6(0x196)][_0x6207e6(0x26c)]();},Game_Battler[_0x2a62ce(0x151)]['updateStatesActionEnd']=function(){const _0x1d3b56=_0x2a62ce;if(BattleManager['_phase']!=='action')return;if(this[_0x1d3b56(0x12d)]===Graphics[_0x1d3b56(0x218)])return;this[_0x1d3b56(0x12d)]=Graphics[_0x1d3b56(0x218)];for(const _0x1e217f of this[_0x1d3b56(0x174)]){const _0x4cbb26=$dataStates[_0x1e217f];if(!_0x4cbb26)continue;if(_0x4cbb26['autoRemovalTiming']!==0x1)continue;this['_stateTurns'][_0x1e217f]>0x0&&this[_0x1d3b56(0xea)][_0x1e217f]--;}this[_0x1d3b56(0xd5)](0x1);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x209)]=function(){const _0x4c4972=_0x2a62ce,_0x30f2a9=VisuMZ[_0x4c4972(0x291)][_0x4c4972(0x22b)][_0x4c4972(0x39a)];for(const _0x25c2bc of this[_0x4c4972(0x174)]){const _0x469464=$dataStates[_0x25c2bc];if(_0x30f2a9&&_0x30f2a9['ActionEndUpdate']!==![]){if(_0x469464&&_0x469464[_0x4c4972(0x223)]===0x1)continue;}this[_0x4c4972(0xea)][_0x25c2bc]>0x0&&this[_0x4c4972(0xea)][_0x25c2bc]--;}},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x106)]=Game_Switches[_0x2a62ce(0x151)][_0x2a62ce(0x24f)],Game_Switches['prototype'][_0x2a62ce(0x24f)]=function(){const _0x365c03=_0x2a62ce;VisuMZ['SkillsStatesCore'][_0x365c03(0x106)][_0x365c03(0x107)](this);const _0x5792ff=VisuMZ['SkillsStatesCore'][_0x365c03(0x22b)][_0x365c03(0x128)][_0x365c03(0xd7)]??!![];if(!_0x5792ff)return;if(SceneManager[_0x365c03(0x1eb)]())for(const _0x2cfc5d of BattleManager['allBattleMembers']()){if(_0x2cfc5d)_0x2cfc5d[_0x365c03(0x287)]();}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3a3)]=Game_Variables[_0x2a62ce(0x151)]['onChange'],Game_Variables[_0x2a62ce(0x151)][_0x2a62ce(0x24f)]=function(){const _0x4251d6=_0x2a62ce;VisuMZ[_0x4251d6(0x291)]['Game_Variables_onChange'][_0x4251d6(0x107)](this);const _0x301aa1=VisuMZ['SkillsStatesCore']['Settings'][_0x4251d6(0x128)]['RefreshCacheVar']??!![];if(!_0x301aa1)return;if(SceneManager['isSceneBattle']())for(const _0x4b833e of BattleManager[_0x4251d6(0x331)]()){if(_0x4b833e)_0x4b833e[_0x4251d6(0x287)]();}},VisuMZ[_0x2a62ce(0x291)]['Game_Action_applyItemUserEffect']=Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x1f0)],Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x1f0)]=function(_0x1db53e){const _0x22e662=_0x2a62ce;VisuMZ[_0x22e662(0x291)][_0x22e662(0x1ba)]['call'](this,_0x1db53e),this[_0x22e662(0x17d)](_0x1db53e);},Game_Action[_0x2a62ce(0x151)]['applySkillsStatesCoreEffects']=function(_0x9b3a6e){const _0x481fae=_0x2a62ce;this[_0x481fae(0x1ee)](_0x9b3a6e),this[_0x481fae(0x15f)](_0x9b3a6e),this[_0x481fae(0x1be)](_0x9b3a6e),this['applyDebuffTurnManipulationEffects'](_0x9b3a6e);},VisuMZ[_0x2a62ce(0x291)]['Game_Action_testApply']=Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x18b)],Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x18b)]=function(_0x58efce){const _0x5ef1c8=_0x2a62ce;if(this['testSkillStatesCoreNotetags'](_0x58efce))return!![];return VisuMZ[_0x5ef1c8(0x291)][_0x5ef1c8(0x2a1)][_0x5ef1c8(0x107)](this,_0x58efce);},Game_Action[_0x2a62ce(0x151)]['testSkillStatesCoreNotetags']=function(_0x7f9ab5){const _0x5d1ccb=_0x2a62ce;if(!this[_0x5d1ccb(0xd6)]())return;const _0x28553b=this[_0x5d1ccb(0xd6)]()[_0x5d1ccb(0x12a)];if(_0x28553b[_0x5d1ccb(0x330)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](.*)>/i)){const _0x4d2046=String(RegExp['$1']);if(_0x7f9ab5['isStateCategoryAffected'](_0x4d2046))return!![];}if(_0x28553b[_0x5d1ccb(0x330)](/<SET STATE[ ](\d+)[ ]TURNS:[ ](.*)>/i)){const _0x55e2ee=Number(RegExp['$1']);if(_0x7f9ab5['isStateAffected'](_0x55e2ee))return!![];}else{if(_0x28553b['match'](/<SET STATE[ ](.*)[ ]TURNS:[ ](.*)>/i)){const _0x23dec4=DataManager['getStateIdWithName'](RegExp['$1']);if(_0x7f9ab5[_0x5d1ccb(0x210)](_0x23dec4))return!![];}}return![];},Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x1ee)]=function(_0x3dddfa){const _0x34a9fa=_0x2a62ce;if(_0x3dddfa[_0x34a9fa(0x1a4)]()[_0x34a9fa(0x121)]<=0x0)return;const _0x5867b3=this[_0x34a9fa(0xd6)]()['note'];{const _0x359b87=_0x5867b3[_0x34a9fa(0x330)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ]ALL>/gi);if(_0x359b87)for(const _0x4cae78 of _0x359b87){_0x4cae78['match'](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ]ALL>/i);const _0x9dd5eb=String(RegExp['$1']);_0x3dddfa[_0x34a9fa(0x347)](_0x9dd5eb);}}{const _0x3bc8a9=_0x5867b3[_0x34a9fa(0x330)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/gi);if(_0x3bc8a9)for(const _0x44850f of _0x3bc8a9){_0x44850f[_0x34a9fa(0x330)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/i);const _0x3f1eb7=String(RegExp['$1']),_0x1b7219=Number(RegExp['$2']);_0x3dddfa[_0x34a9fa(0x36f)](_0x3f1eb7,_0x1b7219);}}},Game_Action[_0x2a62ce(0x151)]['applyStateTurnManipulationEffects']=function(_0x277b35){const _0x125516=_0x2a62ce,_0x559a7f=this[_0x125516(0xd6)]()[_0x125516(0x12a)],_0x5d5f4a=_0x559a7f['match'](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/gi);if(_0x5d5f4a)for(const _0x47e46d of _0x5d5f4a){let _0x1e7a43=0x0,_0x26679a=0x0;if(_0x47e46d['match'](/<SET STATE[ ](\d+)[ ]TURNS:[ ](\d+)>/i))_0x1e7a43=Number(RegExp['$1']),_0x26679a=Number(RegExp['$2']);else _0x47e46d[_0x125516(0x330)](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/i)&&(_0x1e7a43=DataManager[_0x125516(0x2b9)](RegExp['$1']),_0x26679a=Number(RegExp['$2']));_0x277b35['setStateTurns'](_0x1e7a43,_0x26679a),this['makeSuccess'](_0x277b35);}const _0x41eb29=_0x559a7f[_0x125516(0x330)](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/gi);if(_0x41eb29)for(const _0x4b2873 of _0x41eb29){let _0x2737c7=0x0,_0x1b8159=0x0;if(_0x4b2873[_0x125516(0x330)](/<STATE[ ](\d+)[ ]TURNS:[ ]([\+\-]\d+)>/i))_0x2737c7=Number(RegExp['$1']),_0x1b8159=Number(RegExp['$2']);else _0x4b2873[_0x125516(0x330)](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/i)&&(_0x2737c7=DataManager[_0x125516(0x2b9)](RegExp['$1']),_0x1b8159=Number(RegExp['$2']));_0x277b35[_0x125516(0x3b7)](_0x2737c7,_0x1b8159),this[_0x125516(0x118)](_0x277b35);}},Game_Action['prototype'][_0x2a62ce(0x1be)]=function(_0x5ae635){const _0x58d730=_0x2a62ce,_0xc3f6a3=['MAXHP',_0x58d730(0x359),'ATK',_0x58d730(0x19b),'MAT',_0x58d730(0x335),_0x58d730(0x224),_0x58d730(0x19f)],_0x22e192=this[_0x58d730(0xd6)]()[_0x58d730(0x12a)],_0x16ed81=_0x22e192['match'](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/gi);if(_0x16ed81)for(const _0x19ec04 of _0x16ed81){_0x19ec04[_0x58d730(0x330)](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/i);const _0x50465f=_0xc3f6a3[_0x58d730(0x297)](String(RegExp['$1'])[_0x58d730(0x2f9)]()),_0x5f20e3=Number(RegExp['$2']);_0x50465f>=0x0&&(_0x5ae635[_0x58d730(0x362)](_0x50465f,_0x5f20e3),this[_0x58d730(0x118)](_0x5ae635));}const _0x198e38=_0x22e192[_0x58d730(0x330)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0x198e38)for(const _0x19c8ac of _0x16ed81){_0x19c8ac[_0x58d730(0x330)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/i);const _0x51b483=_0xc3f6a3[_0x58d730(0x297)](String(RegExp['$1'])[_0x58d730(0x2f9)]()),_0x4e2081=Number(RegExp['$2']);_0x51b483>=0x0&&(_0x5ae635[_0x58d730(0x3bb)](_0x51b483,_0x4e2081),this[_0x58d730(0x118)](_0x5ae635));}},Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x31e)]=function(_0x1bdd82){const _0x3b4244=_0x2a62ce,_0x4dce88=[_0x3b4244(0x13e),'MAXMP',_0x3b4244(0x29e),'DEF','MAT',_0x3b4244(0x335),_0x3b4244(0x224),_0x3b4244(0x19f)],_0x597f2f=this[_0x3b4244(0xd6)]()[_0x3b4244(0x12a)],_0x3b4cb9=_0x597f2f[_0x3b4244(0x330)](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/gi);if(_0x3b4cb9)for(const _0x38bd7c of _0x3b4cb9){_0x38bd7c[_0x3b4244(0x330)](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/i);const _0x3a01bb=_0x4dce88[_0x3b4244(0x297)](String(RegExp['$1'])['toUpperCase']()),_0x330e99=Number(RegExp['$2']);_0x3a01bb>=0x0&&(_0x1bdd82[_0x3b4244(0x1ff)](_0x3a01bb,_0x330e99),this[_0x3b4244(0x118)](_0x1bdd82));}const _0xa93407=_0x597f2f[_0x3b4244(0x330)](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0xa93407)for(const _0xd86c2e of _0x3b4cb9){_0xd86c2e['match'](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/i);const _0xf98d1a=_0x4dce88[_0x3b4244(0x297)](String(RegExp['$1'])[_0x3b4244(0x2f9)]()),_0xa0d41f=Number(RegExp['$2']);_0xf98d1a>=0x0&&(_0x1bdd82['addDebuffTurns'](_0xf98d1a,_0xa0d41f),this[_0x3b4244(0x118)](_0x1bdd82));}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xb9)]=Game_BattlerBase['prototype']['initMembers'],Game_BattlerBase['prototype']['initMembers']=function(){const _0x10ab98=_0x2a62ce;this[_0x10ab98(0x124)]={},this[_0x10ab98(0xd0)](),VisuMZ[_0x10ab98(0x291)][_0x10ab98(0xb9)][_0x10ab98(0x107)](this);},Game_BattlerBase[_0x2a62ce(0x151)]['initMembersSkillsStatesCore']=function(){const _0x26aa86=_0x2a62ce;this[_0x26aa86(0x298)]='',this[_0x26aa86(0xcc)]={},this[_0x26aa86(0x29d)]={},this[_0x26aa86(0x183)]={},this[_0x26aa86(0x1dd)]={};},Game_BattlerBase['prototype']['checkCacheKey']=function(_0x2f8f82){const _0x468ba9=_0x2a62ce;return this['_cache']=this[_0x468ba9(0x124)]||{},this['_cache'][_0x2f8f82]!==undefined;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x289)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x287)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x287)]=function(){const _0x7ddb1b=_0x2a62ce;this[_0x7ddb1b(0x124)]={},VisuMZ[_0x7ddb1b(0x291)]['Game_BattlerBase_refresh']['call'](this);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x365)]=Game_BattlerBase['prototype'][_0x2a62ce(0x2d2)],Game_BattlerBase[_0x2a62ce(0x151)]['eraseState']=function(_0x2627e7){const _0x11f20f=_0x2a62ce;let _0x14ea8d=this[_0x11f20f(0x210)](_0x2627e7);VisuMZ['SkillsStatesCore'][_0x11f20f(0x365)][_0x11f20f(0x107)](this,_0x2627e7);if(_0x14ea8d&&!this[_0x11f20f(0x210)](_0x2627e7))this[_0x11f20f(0x283)](_0x2627e7);},Game_BattlerBase['prototype'][_0x2a62ce(0x283)]=function(_0x5615b1){const _0x1d53da=_0x2a62ce;this[_0x1d53da(0x329)](_0x5615b1),this[_0x1d53da(0x390)](_0x5615b1);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x2b5)]=Game_Battler['prototype'][_0x2a62ce(0x1f5)],Game_Battler[_0x2a62ce(0x151)]['onBattleEnd']=function(){const _0x136301=_0x2a62ce;VisuMZ[_0x136301(0x291)]['Game_Battler_onBattleEnd'][_0x136301(0x107)](this),this['clearAllStateOrigins'](),this[_0x136301(0x19a)]=0x0,this[_0x136301(0x3ab)]=0x0;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x236)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0xc5)],Game_BattlerBase['prototype'][_0x2a62ce(0xc5)]=function(_0x57d789){const _0x4fa8d8=_0x2a62ce,_0x3b531e=$dataStates[_0x57d789],_0x2ad344=this[_0x4fa8d8(0x299)](_0x57d789),_0x5dd772=this[_0x4fa8d8(0xe0)](_0x3b531e)[_0x4fa8d8(0x1fe)]()[_0x4fa8d8(0x2dc)]();switch(_0x5dd772){case'ignore':if(_0x2ad344<=0x0)this['prepareResetStateCounts'](_0x57d789);break;case _0x4fa8d8(0x2cc):this[_0x4fa8d8(0x308)](_0x57d789);break;case _0x4fa8d8(0x2ac):this['prepareResetStateCounts'](_0x57d789),this[_0x4fa8d8(0xea)][_0x57d789]=Math[_0x4fa8d8(0x34e)](this[_0x4fa8d8(0xea)][_0x57d789],_0x2ad344);break;case _0x4fa8d8(0x2c0):this[_0x4fa8d8(0x308)](_0x57d789),this[_0x4fa8d8(0xea)][_0x57d789]+=_0x2ad344;break;default:this[_0x4fa8d8(0x308)](_0x57d789);break;}if(this['isStateAffected'](_0x57d789)){const _0x7c1106=DataManager[_0x4fa8d8(0x19c)](_0x57d789);this[_0x4fa8d8(0xea)][_0x57d789]=this[_0x4fa8d8(0xea)][_0x57d789][_0x4fa8d8(0x24d)](0x0,_0x7c1106);}},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x308)]=function(_0x531af8){const _0x1e39bd=_0x2a62ce;VisuMZ[_0x1e39bd(0x291)][_0x1e39bd(0x236)][_0x1e39bd(0x107)](this,_0x531af8);},Game_BattlerBase['prototype'][_0x2a62ce(0xe0)]=function(_0x43bdb2){const _0x43e655=_0x2a62ce,_0x1b2a81=_0x43bdb2['note'];return _0x1b2a81[_0x43e655(0x330)](/<REAPPLY RULES:[ ](.*)>/i)?String(RegExp['$1']):VisuMZ[_0x43e655(0x291)]['Settings'][_0x43e655(0x39a)]['ReapplyRules'];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xf2)]=Game_BattlerBase[_0x2a62ce(0x151)]['overwriteBuffTurns'],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x364)]=function(_0x20dcae,_0x49b27d){const _0xcb8d71=_0x2a62ce,_0x30a56f=VisuMZ[_0xcb8d71(0x291)][_0xcb8d71(0x22b)]['Buffs'][_0xcb8d71(0x30d)],_0x19270d=this[_0xcb8d71(0x38a)](_0x20dcae);switch(_0x30a56f){case'ignore':if(_0x19270d<=0x0)this[_0xcb8d71(0x112)][_0x20dcae]=_0x49b27d;break;case _0xcb8d71(0x2cc):this[_0xcb8d71(0x112)][_0x20dcae]=_0x49b27d;break;case _0xcb8d71(0x2ac):this[_0xcb8d71(0x112)][_0x20dcae]=Math[_0xcb8d71(0x34e)](_0x19270d,_0x49b27d);break;case'add':this['_buffTurns'][_0x20dcae]+=_0x49b27d;break;default:VisuMZ[_0xcb8d71(0x291)][_0xcb8d71(0xf2)]['call'](this,_0x20dcae,_0x49b27d);break;}const _0x4dbc0f=VisuMZ[_0xcb8d71(0x291)][_0xcb8d71(0x22b)][_0xcb8d71(0x14f)][_0xcb8d71(0x136)];this[_0xcb8d71(0x112)][_0x20dcae]=this[_0xcb8d71(0x112)][_0x20dcae][_0xcb8d71(0x24d)](0x0,_0x4dbc0f);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x3a4)]=function(){const _0x51a9ba=_0x2a62ce;if(this[_0x51a9ba(0x124)][_0x51a9ba(0x22f)]!==undefined)return this['_cache'][_0x51a9ba(0x22f)];this[_0x51a9ba(0x124)][_0x51a9ba(0x22f)]=![];const _0x510ab8=this[_0x51a9ba(0x1a4)]();for(const _0x2483a9 of _0x510ab8){if(!_0x2483a9)continue;if(_0x2483a9[_0x51a9ba(0x12a)][_0x51a9ba(0x330)](/<GROUP DEFEAT>/i)){this[_0x51a9ba(0x124)][_0x51a9ba(0x22f)]=!![];break;}}return this[_0x51a9ba(0x124)][_0x51a9ba(0x22f)];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x32b)]=Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0x15d)],Game_Unit[_0x2a62ce(0x151)]['deadMembers']=function(){const _0x3d5947=_0x2a62ce;let _0x4b2f21=VisuMZ[_0x3d5947(0x291)][_0x3d5947(0x32b)]['call'](this);return BattleManager[_0x3d5947(0x295)]&&(_0x4b2f21=_0x4b2f21[_0x3d5947(0x114)](this['members']()[_0x3d5947(0x240)](_0x196d0f=>_0x196d0f[_0x3d5947(0x3a4)]()))),_0x4b2f21;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x16c)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x293)],Game_BattlerBase[_0x2a62ce(0x151)]['clearStates']=function(){const _0x507b65=_0x2a62ce;this[_0x507b65(0x126)]()!==''?this[_0x507b65(0x324)]():(VisuMZ[_0x507b65(0x291)]['Game_BattlerBase_clearStates']['call'](this),this[_0x507b65(0xd0)]());},Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x293)]=function(){const _0x33fa5c=_0x2a62ce;this['_stateSteps']=this['_stateSteps']||{},Game_Battler[_0x33fa5c(0x151)][_0x33fa5c(0x293)][_0x33fa5c(0x107)](this);},Game_BattlerBase['prototype'][_0x2a62ce(0x324)]=function(){const _0x285a16=_0x2a62ce,_0xa93f14=this['states']();for(const _0x240c45 of _0xa93f14){if(_0x240c45&&this['canClearState'](_0x240c45))this[_0x285a16(0x2d2)](_0x240c45['id']);}this['_cache']={};},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x29a)]=function(_0x492161){const _0x583f73=_0x2a62ce,_0x252ea7=this['getStateRetainType']();if(_0x252ea7!==''){const _0x1f072d=_0x492161[_0x583f73(0x12a)];if(_0x252ea7===_0x583f73(0x317)&&_0x1f072d[_0x583f73(0x330)](/<NO DEATH CLEAR>/i))return![];if(_0x252ea7===_0x583f73(0x357)&&_0x1f072d[_0x583f73(0x330)](/<NO RECOVER ALL CLEAR>/i))return![];}return this['isStateAffected'](_0x492161['id']);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x126)]=function(){const _0x336864=_0x2a62ce;return this[_0x336864(0x298)];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x35e)]=function(_0x432a58){const _0x56f81f=_0x2a62ce;this[_0x56f81f(0x298)]=_0x432a58;},Game_BattlerBase['prototype'][_0x2a62ce(0x2fa)]=function(){this['_stateRetainType']='';},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x270)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x16f)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x16f)]=function(){const _0x1d3fa9=_0x2a62ce;this['setStateRetainType'](_0x1d3fa9(0x317)),VisuMZ[_0x1d3fa9(0x291)][_0x1d3fa9(0x270)][_0x1d3fa9(0x107)](this),this[_0x1d3fa9(0x2fa)]();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x178)]=Game_BattlerBase['prototype'][_0x2a62ce(0xe2)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0xe2)]=function(){const _0x575bed=_0x2a62ce;this[_0x575bed(0x35e)](_0x575bed(0x357)),VisuMZ[_0x575bed(0x291)][_0x575bed(0x178)][_0x575bed(0x107)](this),this[_0x575bed(0x2fa)]();},Game_BattlerBase[_0x2a62ce(0x151)]['adjustSkillCost']=function(_0x4ee286,_0x4ddec6,_0x3f6be9){return _0x4ddec6;},Game_BattlerBase['prototype']['canPaySkillCost']=function(_0x4f2154){const _0x32e147=_0x2a62ce;for(settings of VisuMZ[_0x32e147(0x291)]['Settings'][_0x32e147(0x1b1)]){let _0x544924=settings[_0x32e147(0x217)][_0x32e147(0x107)](this,_0x4f2154);_0x544924=this[_0x32e147(0x180)](_0x4f2154,_0x544924,settings);if(!settings[_0x32e147(0x1a9)][_0x32e147(0x107)](this,_0x4f2154,_0x544924))return![];}return!![];},Game_BattlerBase['prototype'][_0x2a62ce(0x37c)]=function(_0x548d30){const _0x37752a=_0x2a62ce;for(settings of VisuMZ[_0x37752a(0x291)][_0x37752a(0x22b)]['Costs']){let _0x1b341b=settings['CalcJS'][_0x37752a(0x107)](this,_0x548d30);_0x1b341b=this[_0x37752a(0x180)](_0x548d30,_0x1b341b,settings),settings[_0x37752a(0x1fb)][_0x37752a(0x107)](this,_0x548d30,_0x1b341b);}},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x31f)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2d5)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2d5)]=function(_0x2334ba){const _0x676b68=_0x2a62ce;if(!_0x2334ba)return![];if(!VisuMZ[_0x676b68(0x291)]['Game_BattlerBase_meetsSkillConditions'][_0x676b68(0x107)](this,_0x2334ba))return![];if(!this[_0x676b68(0x133)](_0x2334ba))return![];if(!this[_0x676b68(0x2d6)](_0x2334ba))return![];if(!this[_0x676b68(0xc4)](_0x2334ba))return![];return!![];},Game_BattlerBase['prototype'][_0x2a62ce(0x133)]=function(_0x51a6af){const _0x13d53c=_0x2a62ce;if(!this[_0x13d53c(0x310)](_0x51a6af))return![];return!![];},Game_BattlerBase[_0x2a62ce(0x151)]['checkSkillConditionsSwitchNotetags']=function(_0x1115eb){const _0x687b90=_0x2a62ce,_0x2ed64f=_0x1115eb[_0x687b90(0x12a)];if(_0x2ed64f[_0x687b90(0x330)](/<ENABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2c4810=JSON['parse']('['+RegExp['$1'][_0x687b90(0x330)](/\d+/g)+']');for(const _0x1c862e of _0x2c4810){if(!$gameSwitches['value'](_0x1c862e))return![];}return!![];}if(_0x2ed64f[_0x687b90(0x330)](/<ENABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x797fe4=JSON[_0x687b90(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x1d2af5 of _0x797fe4){if(!$gameSwitches[_0x687b90(0x34a)](_0x1d2af5))return![];}return!![];}if(_0x2ed64f['match'](/<ENABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2e90b8=JSON[_0x687b90(0x342)]('['+RegExp['$1'][_0x687b90(0x330)](/\d+/g)+']');for(const _0x49c098 of _0x2e90b8){if($gameSwitches[_0x687b90(0x34a)](_0x49c098))return!![];}return![];}if(_0x2ed64f[_0x687b90(0x330)](/<DISABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1765e6=JSON[_0x687b90(0x342)]('['+RegExp['$1'][_0x687b90(0x330)](/\d+/g)+']');for(const _0xcc6299 of _0x1765e6){if(!$gameSwitches['value'](_0xcc6299))return!![];}return![];}if(_0x2ed64f[_0x687b90(0x330)](/<DISABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5e346f=JSON[_0x687b90(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x379baa of _0x5e346f){if(!$gameSwitches[_0x687b90(0x34a)](_0x379baa))return!![];}return![];}if(_0x2ed64f[_0x687b90(0x330)](/<DISABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2387ec=JSON[_0x687b90(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x575e4d of _0x2387ec){if($gameSwitches['value'](_0x575e4d))return![];}return!![];}return!![];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2d6)]=function(_0x2eb95a){const _0x493da3=_0x2a62ce,_0x22c22d=_0x2eb95a['note'],_0x1cac50=VisuMZ[_0x493da3(0x291)]['skillEnableJS'];return _0x1cac50[_0x2eb95a['id']]?_0x1cac50[_0x2eb95a['id']][_0x493da3(0x107)](this,_0x2eb95a):!![];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0xc4)]=function(_0x4ee9d7){const _0x552dc8=_0x2a62ce;return VisuMZ[_0x552dc8(0x291)][_0x552dc8(0x22b)][_0x552dc8(0x314)]['SkillConditionJS']['call'](this,_0x4ee9d7);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x245)]=Game_BattlerBase['prototype'][_0x2a62ce(0x173)],Game_BattlerBase[_0x2a62ce(0x151)]['skillMpCost']=function(_0x237b66){const _0x535d38=_0x2a62ce;for(settings of VisuMZ['SkillsStatesCore'][_0x535d38(0x22b)][_0x535d38(0x1b1)]){if(settings[_0x535d38(0x302)][_0x535d38(0x2f9)]()==='MP'){let _0x4af969=settings[_0x535d38(0x217)][_0x535d38(0x107)](this,_0x237b66);return _0x4af969=this['adjustSkillCost'](_0x237b66,_0x4af969,settings),_0x4af969;}}return VisuMZ[_0x535d38(0x291)][_0x535d38(0x245)]['call'](this,_0x237b66);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2f2)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2b2)],Game_BattlerBase['prototype'][_0x2a62ce(0x2b2)]=function(_0x1133e1){const _0x48d79d=_0x2a62ce;for(settings of VisuMZ['SkillsStatesCore'][_0x48d79d(0x22b)][_0x48d79d(0x1b1)]){if(settings[_0x48d79d(0x302)][_0x48d79d(0x2f9)]()==='TP'){let _0x3f5526=settings[_0x48d79d(0x217)][_0x48d79d(0x107)](this,_0x1133e1);return _0x3f5526=this['adjustSkillCost'](_0x1133e1,_0x3f5526,settings),_0x3f5526;}}return VisuMZ[_0x48d79d(0x291)][_0x48d79d(0x2f2)]['call'](this,_0x1133e1);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x37d)]=function(_0x13107e){const _0x20d7a3=_0x2a62ce;if(typeof _0x13107e===_0x20d7a3(0x148))_0x13107e=$dataStates[_0x13107e];return this['states']()[_0x20d7a3(0x336)](_0x13107e);},VisuMZ[_0x2a62ce(0x291)]['Game_BattlerBase_states']=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1a4)],Game_BattlerBase['prototype'][_0x2a62ce(0x1a4)]=function(){const _0x37d803=_0x2a62ce;let _0x3dbcf3=VisuMZ[_0x37d803(0x291)][_0x37d803(0x2e7)][_0x37d803(0x107)](this);if($gameTemp[_0x37d803(0x228)])return _0x3dbcf3;return $gameTemp[_0x37d803(0x228)]=!![],this['addPassiveStates'](_0x3dbcf3),$gameTemp[_0x37d803(0x228)]=undefined,_0x3dbcf3;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2ca)]=function(_0x4c261c){const _0x3444ae=_0x2a62ce,_0x5823ec=this[_0x3444ae(0xc9)]();for(state of _0x5823ec){if(!state)continue;if(!this['isPassiveStateStackable'](state)&&_0x4c261c[_0x3444ae(0x336)](state))continue;_0x4c261c[_0x3444ae(0x27e)](state);}_0x5823ec[_0x3444ae(0x121)]>0x0&&_0x4c261c['sort']((_0x578f15,_0x18d218)=>{const _0x13cc6e=_0x3444ae,_0x28e53e=_0x578f15[_0x13cc6e(0x187)],_0x270d79=_0x18d218['priority'];if(_0x28e53e!==_0x270d79)return _0x270d79-_0x28e53e;return _0x578f15-_0x18d218;});},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x206)]=function(_0x13604e){const _0x29473d=_0x2a62ce;return _0x13604e['note'][_0x29473d(0x330)](/<PASSIVE STACKABLE>/i);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x346)]=Game_BattlerBase['prototype'][_0x2a62ce(0x352)],Game_BattlerBase['prototype']['traitsSet']=function(_0x5bc5ae){const _0x44283c=_0x2a62ce;this[_0x44283c(0x10f)]=!![];let _0x1b91fc=VisuMZ[_0x44283c(0x291)][_0x44283c(0x346)][_0x44283c(0x107)](this,_0x5bc5ae);return this[_0x44283c(0x10f)]=undefined,_0x1b91fc;},Game_BattlerBase['prototype'][_0x2a62ce(0xba)]=function(){const _0x35ae95=_0x2a62ce;let _0x24678b=[];this[_0x35ae95(0x1ea)]=this[_0x35ae95(0x1ea)]||{};for(;;){_0x24678b=[];let _0x70122c=!![];for(const _0xe3f081 of this['_cache'][_0x35ae95(0xc9)]){const _0x5b67b4=$dataStates[_0xe3f081];if(!_0x5b67b4)continue;let _0x4da1d7=this[_0x35ae95(0x2e8)](_0x5b67b4);this[_0x35ae95(0x1ea)][_0xe3f081]!==_0x4da1d7&&(_0x70122c=![],this[_0x35ae95(0x1ea)][_0xe3f081]=_0x4da1d7);if(!_0x4da1d7)continue;_0x24678b['push'](_0x5b67b4);}if(_0x70122c)break;else{if(!this[_0x35ae95(0x10f)])this[_0x35ae95(0x287)]();this[_0x35ae95(0x1a1)]();}}return _0x24678b;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2e8)]=function(_0x207cd5){const _0x88b343=_0x2a62ce;if(!this[_0x88b343(0x30b)](_0x207cd5))return![];if(!this[_0x88b343(0xd1)](_0x207cd5))return![];if(!this[_0x88b343(0x195)](_0x207cd5))return![];if(!this[_0x88b343(0x3aa)](_0x207cd5))return![];return!![];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x30b)]=function(_0x4bfced){return!![];},Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x30b)]=function(_0x17592e){const _0x5822d4=_0x2a62ce,_0x241600=DataManager[_0x5822d4(0x172)](_0x17592e);if(_0x241600[_0x5822d4(0x285)][_0x5822d4(0x121)]>0x0){const _0x43d155=_0x241600[_0x5822d4(0x285)];if(!_0x43d155[_0x5822d4(0x336)](this[_0x5822d4(0x285)]()))return![];}if(_0x241600[_0x5822d4(0x313)][_0x5822d4(0x121)]>0x0){const _0x54b187=_0x241600[_0x5822d4(0x313)];let _0x24757d=[this[_0x5822d4(0x285)]()];Imported[_0x5822d4(0x392)]&&this[_0x5822d4(0x2a3)]&&(_0x24757d=this['multiclasses']());if(_0x54b187[_0x5822d4(0x240)](_0x23ddb7=>_0x24757d[_0x5822d4(0x336)](_0x23ddb7))[_0x5822d4(0x121)]<=0x0)return![];}return Game_BattlerBase[_0x5822d4(0x151)]['meetsPassiveStateConditionClasses'][_0x5822d4(0x107)](this,_0x17592e);},DataManager[_0x2a62ce(0x172)]=function(_0x32add8){const _0x5e4294=_0x2a62ce,_0x17e658={'currentClass':[],'multiClass':[]};if(!_0x32add8)return _0x17e658;this[_0x5e4294(0xfe)]=this['_cache_getPassiveStateConditionClassesData']||{};if(this[_0x5e4294(0xfe)][_0x32add8['id']]!==undefined)return this[_0x5e4294(0xfe)][_0x32add8['id']];const _0x54a12e=_0x32add8[_0x5e4294(0x12a)]||'';if(_0x54a12e[_0x5e4294(0x330)](/<PASSIVE CONDITION[ ](?:CLASS|CLASSES):[ ](.*)>/i)){const _0x48ffed=String(RegExp['$1'])[_0x5e4294(0x181)](',')[_0x5e4294(0xcf)](_0x4d7725=>_0x4d7725['trim']());_0x17e658[_0x5e4294(0x285)]=VisuMZ['SkillsStatesCore'][_0x5e4294(0x17b)](_0x48ffed);}if(_0x54a12e[_0x5e4294(0x330)](/<PASSIVE CONDITION[ ](?:MULTICLASS|MULTICLASSES):[ ](.*)>/i)){const _0x22cc4a=String(RegExp['$1'])[_0x5e4294(0x181)](',')[_0x5e4294(0xcf)](_0x2d6d53=>_0x2d6d53[_0x5e4294(0x2dc)]());_0x17e658[_0x5e4294(0x313)]=VisuMZ['SkillsStatesCore']['ParseClassIDs'](_0x22cc4a);}return this[_0x5e4294(0xfe)][_0x32add8['id']]=_0x17e658,this[_0x5e4294(0xfe)][_0x32add8['id']];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x17b)]=function(_0x341584){const _0x1dba6e=_0x2a62ce,_0x1b0d3e=[];for(let _0x2ff493 of _0x341584){_0x2ff493=(String(_0x2ff493)||'')[_0x1dba6e(0x2dc)]();const _0x4975d7=/^\d+$/['test'](_0x2ff493);_0x4975d7?_0x1b0d3e[_0x1dba6e(0x27e)](Number(_0x2ff493)):_0x1b0d3e[_0x1dba6e(0x27e)](DataManager[_0x1dba6e(0x2dd)](_0x2ff493));}return _0x1b0d3e[_0x1dba6e(0xcf)](_0x3c533e=>$dataClasses[Number(_0x3c533e)])[_0x1dba6e(0x12b)](null);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0xd1)]=function(_0x4d1ea2){const _0x47ef2f=_0x2a62ce,_0x36b08e=DataManager[_0x47ef2f(0x3af)](_0x4d1ea2);if(_0x36b08e[_0x47ef2f(0x249)]&&_0x36b08e['allSwitchOn'][_0x47ef2f(0x121)]>0x0){const _0x515757=_0x36b08e[_0x47ef2f(0x249)];for(const _0x2abedd of _0x515757){if(!$gameSwitches[_0x47ef2f(0x34a)](_0x2abedd))return![];}}if(_0x36b08e[_0x47ef2f(0x3b0)]&&_0x36b08e['anySwitchOn']['length']>0x0){const _0x227383=_0x36b08e[_0x47ef2f(0x3b0)];let _0x633e94=!![];for(const _0x26be80 of _0x227383){if($gameSwitches[_0x47ef2f(0x34a)](_0x26be80)){_0x633e94=![];break;}}if(_0x633e94)return![];}if(_0x36b08e[_0x47ef2f(0x356)]&&_0x36b08e[_0x47ef2f(0x356)]['length']>0x0){const _0x3356e2=_0x36b08e[_0x47ef2f(0x356)];for(const _0x469a5a of _0x3356e2){if($gameSwitches[_0x47ef2f(0x34a)](_0x469a5a))return![];}}if(_0x36b08e[_0x47ef2f(0xd9)]&&_0x36b08e[_0x47ef2f(0xd9)][_0x47ef2f(0x121)]>0x0){const _0x168ca4=_0x36b08e[_0x47ef2f(0xd9)];let _0x50c4ca=!![];for(const _0x262a2e of _0x168ca4){if(!$gameSwitches['value'](_0x262a2e)){_0x50c4ca=![];break;}}if(_0x50c4ca)return![];}return!![];},DataManager[_0x2a62ce(0x3af)]=function(_0x5bc154){const _0x3c92e4=_0x2a62ce;let _0x7cfa8a={'allSwitchOn':[],'anySwitchOn':[],'allSwitchOff':[],'anySwitchOff':[]};if(!_0x5bc154)return _0x7cfa8a;const _0x2fdb66=_0x5bc154['id'];this[_0x3c92e4(0x3c8)]=this[_0x3c92e4(0x3c8)]||{};if(this[_0x3c92e4(0x3c8)][_0x2fdb66]!==undefined)return this[_0x3c92e4(0x3c8)][_0x2fdb66];const _0x5d91c0=_0x5bc154[_0x3c92e4(0x12a)]||'';return _0x5d91c0[_0x3c92e4(0x330)](/PASSIVE CONDITION(?:| ALL)[ ](?:SWITCH|SWITCHES)[ ]ON:[ ](.*)>/i)&&(_0x7cfa8a[_0x3c92e4(0x249)]=String(RegExp['$1'])[_0x3c92e4(0x181)](',')[_0x3c92e4(0xcf)](_0x4bb5c2=>Number(_0x4bb5c2))),_0x5d91c0[_0x3c92e4(0x330)](/PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]ON:[ ](.*)>/i)&&(_0x7cfa8a[_0x3c92e4(0x3b0)]=String(RegExp['$1'])[_0x3c92e4(0x181)](',')[_0x3c92e4(0xcf)](_0x4f6e6a=>Number(_0x4f6e6a))),_0x5d91c0[_0x3c92e4(0x330)](/PASSIVE CONDITION(?:| ALL)[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ](.*)>/i)&&(_0x7cfa8a[_0x3c92e4(0x356)]=String(RegExp['$1'])['split'](',')[_0x3c92e4(0xcf)](_0x4c3228=>Number(_0x4c3228))),_0x5d91c0[_0x3c92e4(0x330)](/PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ](.*)>/i)&&(_0x7cfa8a[_0x3c92e4(0xd9)]=String(RegExp['$1'])[_0x3c92e4(0x181)](',')[_0x3c92e4(0xcf)](_0x227b53=>Number(_0x227b53))),this[_0x3c92e4(0x3c8)][_0x2fdb66]=_0x7cfa8a,this[_0x3c92e4(0x3c8)][_0x2fdb66];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x195)]=function(_0x10dc1d){const _0x318408=_0x2a62ce,_0x13c0ff=VisuMZ[_0x318408(0x291)][_0x318408(0x1ce)];if(_0x13c0ff[_0x10dc1d['id']]){this['_prevPassiveJsFrameCount']=this[_0x318408(0x19a)]||0x0,this[_0x318408(0x3ab)]=this[_0x318408(0x3ab)]||0x0;this['_prevPassiveJsFrameCount']!==Graphics[_0x318408(0x218)]&&(this[_0x318408(0x19a)]=Graphics[_0x318408(0x218)],this['_prevPassiveJsResults']={},this[_0x318408(0x3ab)]=0x0);this[_0x318408(0x3ab)]++;if(this['_prevPassiveJsCounter']>=0x1e)return this[_0x318408(0x1bf)][_0x10dc1d['id']]??!![];else{const _0x2f04e4=_0x13c0ff[_0x10dc1d['id']][_0x318408(0x107)](this,_0x10dc1d);return this['_prevPassiveJsResults'][_0x10dc1d['id']]=_0x2f04e4,_0x2f04e4;}}else return!![];},Game_BattlerBase[_0x2a62ce(0x151)]['meetsPassiveStateGlobalConditionJS']=function(_0x55987c){const _0x534753=_0x2a62ce;return VisuMZ[_0x534753(0x291)][_0x534753(0x22b)]['PassiveStates']['PassiveConditionJS'][_0x534753(0x107)](this,_0x55987c);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0xc9)]=function(){const _0x4c1a0d=_0x2a62ce;if(this[_0x4c1a0d(0x242)](_0x4c1a0d(0xc9)))return this[_0x4c1a0d(0xba)]();if(this[_0x4c1a0d(0x12e)])return[];return this[_0x4c1a0d(0x12e)]=!![],this[_0x4c1a0d(0x1a1)](),this[_0x4c1a0d(0x12e)]=undefined,this[_0x4c1a0d(0xba)]();},Game_BattlerBase['prototype'][_0x2a62ce(0x1a1)]=function(){const _0x2a7ee0=_0x2a62ce;this[_0x2a7ee0(0x12e)]=!![],this[_0x2a7ee0(0x124)]['passiveStates']=[],this[_0x2a7ee0(0x37f)](),this['addPassiveStatesByNotetag'](),this['addPassiveStatesByPluginParameters'](),Game_BattlerBase[_0x2a7ee0(0x1fd)]&&this[_0x2a7ee0(0x35b)](),this['_cache'][_0x2a7ee0(0xc9)]=this[_0x2a7ee0(0x124)][_0x2a7ee0(0xc9)][_0x2a7ee0(0x389)]((_0x5d9972,_0x3ab96a)=>_0x5d9972-_0x3ab96a),this[_0x2a7ee0(0x12e)]=undefined;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x37f)]=function(){const _0x5791d1=_0x2a62ce;if(Imported[_0x5791d1(0x337)])this[_0x5791d1(0x1fa)]();},Game_BattlerBase['prototype']['passiveStateObjects']=function(){return[];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x238)]=function(){const _0x342f3d=_0x2a62ce,_0xab1a68=this[_0x342f3d(0x124)]['passiveStates']||[],_0x3d8dc4=this['passiveStateObjects']();this[_0x342f3d(0x124)][_0x342f3d(0xc9)]=_0xab1a68||[];for(const _0x499d4b of _0x3d8dc4){if(!_0x499d4b)continue;const _0x3c02ed=DataManager[_0x342f3d(0x23e)](_0x499d4b);for(const _0x539b42 of _0x3c02ed){this[_0x342f3d(0x124)][_0x342f3d(0xc9)]['push'](_0x539b42);}}},DataManager['getPassiveStatesFromObj']=function(_0xd885c0){const _0x555a3b=_0x2a62ce;if(!_0xd885c0)return[];const _0x223277=VisuMZ[_0x555a3b(0x291)][_0x555a3b(0x2a2)](_0xd885c0,_0x555a3b(0x38c));this['_cache_getPassiveStatesFromObj']=this[_0x555a3b(0x225)]||{};if(this['_cache_getPassiveStatesFromObj'][_0x223277]!==undefined)return this[_0x555a3b(0x225)][_0x223277];const _0x16b743=[],_0x4b0c0f=_0xd885c0[_0x555a3b(0x12a)]||'',_0x2ee445=/<PASSIVE (?:STATE|STATES):[ ](.*)>/gi,_0x3ed684=_0x4b0c0f[_0x555a3b(0x330)](_0x2ee445);if(_0x3ed684)for(const _0x371809 of _0x3ed684){_0x371809[_0x555a3b(0x330)](_0x2ee445);const _0x264acc=String(RegExp['$1'])[_0x555a3b(0x181)](',')['map'](_0x56ad55=>_0x56ad55[_0x555a3b(0x2dc)]());for(const _0x400b9e of _0x264acc){const _0x4b344f=/^\d+$/[_0x555a3b(0x22e)](_0x400b9e);let _0x2950e9=0x0;_0x4b344f?_0x2950e9=Number(_0x400b9e):_0x2950e9=DataManager[_0x555a3b(0x2b9)](_0x400b9e),_0x2950e9&&_0x16b743[_0x555a3b(0x27e)](_0x2950e9);}}return this[_0x555a3b(0x225)][_0x223277]=_0x16b743,this[_0x555a3b(0x225)][_0x223277];},Game_BattlerBase[_0x2a62ce(0x151)]['addPassiveStatesByPluginParameters']=function(){const _0x1155da=_0x2a62ce,_0x378f90=VisuMZ[_0x1155da(0x291)]['Settings'][_0x1155da(0x128)][_0x1155da(0x197)];this[_0x1155da(0x124)]['passiveStates']=this[_0x1155da(0x124)]['passiveStates'][_0x1155da(0x114)](_0x378f90);},Game_BattlerBase[_0x2a62ce(0x1fd)]=![],Scene_Boot['prototype']['process_VisuMZ_SkillsStatesCore_CheckForAuras']=function(){const _0x35a68c=_0x2a62ce,_0x25d122=[$dataActors,$dataClasses,$dataSkills,$dataWeapons,$dataArmors,$dataEnemies];for(const _0x4dcb49 of _0x25d122){for(const _0xe5c41c of _0x4dcb49){if(!_0xe5c41c)continue;const _0x3e75b7=_0xe5c41c[_0x35a68c(0x12a)]||'';if(_0x3e75b7[_0x35a68c(0x330)](/<(?:AURA|MIASMA) (?:STATE|STATES):[ ](.*)>/gi)){Game_BattlerBase[_0x35a68c(0x1fd)]=!![];break;}}}},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x35b)]=function(){const _0x2c07f8=_0x2a62ce;if(this[_0x2c07f8(0x1f4)]())return;if(!this[_0x2c07f8(0x125)]())return;const _0x399d8e=this[_0x2c07f8(0x124)][_0x2c07f8(0xc9)]||[],_0x814e7d=this,_0x315bf8=this[_0x2c07f8(0x31b)]()['getAuraPassiveStateIDs'](!![],_0x814e7d),_0x12833b=$gameParty[_0x2c07f8(0x322)]()?this[_0x2c07f8(0x102)]()[_0x2c07f8(0x157)](![],_0x814e7d):[];this[_0x2c07f8(0x124)][_0x2c07f8(0xc9)]=_0x399d8e||[],this[_0x2c07f8(0x124)][_0x2c07f8(0xc9)]=this[_0x2c07f8(0x124)][_0x2c07f8(0xc9)]['concat'](_0x315bf8)[_0x2c07f8(0x114)](_0x12833b);},Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0x157)]=function(_0x2537b5,_0x5c952a){const _0x426984=_0x2a62ce;let _0x475cd5=[];const _0x403ad5=this===$gameParty?this[_0x426984(0x2c2)]():this[_0x426984(0x32a)]();for(const _0x4a4088 of _0x403ad5){if(!_0x4a4088)continue;if(!_0x4a4088[_0x426984(0x125)]())continue;const _0x5f1e69=_0x4a4088['passiveStateObjects']();for(const _0xaecdf7 of _0x5f1e69){if(!_0xaecdf7)continue;if(!VisuMZ[_0x426984(0x291)][_0x426984(0x2f7)](_0xaecdf7,_0x2537b5,_0x4a4088,_0x5c952a))continue;let _0x30792a=DataManager[_0x426984(0x3b9)](_0xaecdf7,_0x2537b5);for(const _0x10626a of _0x30792a){if(!VisuMZ[_0x426984(0x291)][_0x426984(0x15b)](_0x10626a,_0x2537b5,_0x4a4088,_0x5c952a))continue;_0x475cd5[_0x426984(0x27e)](_0x10626a),!_0x5c952a[_0x426984(0x210)](_0x10626a)&&_0x5c952a[_0x426984(0x27a)](_0x10626a,_0x4a4088);}}}return _0x475cd5;},DataManager[_0x2a62ce(0x3b9)]=function(_0x3efd76,_0x419f7d){const _0x19d2a1=_0x2a62ce;if(!_0x3efd76)return[];const _0x2b0ab2=_0x419f7d?_0x19d2a1(0xc0):_0x19d2a1(0x233),_0xb38ea2=VisuMZ[_0x19d2a1(0x291)]['createKeyJS'](_0x3efd76,_0x2b0ab2);this[_0x19d2a1(0x3b6)]=this[_0x19d2a1(0x3b6)]||{};if(this[_0x19d2a1(0x3b6)][_0xb38ea2]!==undefined)return this[_0x19d2a1(0x3b6)][_0xb38ea2];const _0x2b650b=[],_0x112382=_0x3efd76[_0x19d2a1(0x12a)]||'',_0x196b5c=_0x419f7d?/<AURA (?:STATE|STATES):[ ](.*)>/gi:/<MIASMA (?:STATE|STATES):[ ](.*)>/gi,_0x1c8ae1=_0x112382[_0x19d2a1(0x330)](_0x196b5c);if(_0x1c8ae1)for(const _0x35e877 of _0x1c8ae1){_0x35e877[_0x19d2a1(0x330)](_0x196b5c);const _0x557133=String(RegExp['$1'])[_0x19d2a1(0x181)](',')[_0x19d2a1(0xcf)](_0x1e125b=>_0x1e125b[_0x19d2a1(0x2dc)]());for(const _0x1ba142 of _0x557133){const _0x813589=/^\d+$/[_0x19d2a1(0x22e)](_0x1ba142);let _0x4aee36=0x0;_0x813589?_0x4aee36=Number(_0x1ba142):_0x4aee36=DataManager[_0x19d2a1(0x2b9)](_0x1ba142),_0x4aee36&&_0x2b650b[_0x19d2a1(0x27e)](_0x4aee36);}}return this['_cache_getAuraPassiveStatesFromObj'][_0xb38ea2]=_0x2b650b,this[_0x19d2a1(0x3b6)][_0xb38ea2];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2f7)]=function(_0x3bf6cb,_0x4616dd,_0xc170e7,_0x2bf64c){const _0x298031=_0x2a62ce;if(!_0x3bf6cb)return![];if(_0x3bf6cb[_0x298031(0x223)]!==undefined&&_0x3bf6cb['maxTurns']!==undefined)return![];const _0x157574=_0x3bf6cb['note']||'';if(!VisuMZ[_0x298031(0x291)][_0x298031(0x2ee)](_0x157574,_0x4616dd,_0xc170e7,_0x2bf64c))return![];return!![];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x15b)]=function(_0x5bb78d,_0x3717c6,_0x1ab72d,_0x2d6b20){const _0x40e376=_0x2a62ce,_0x5b4e09=$dataStates[_0x5bb78d];if(!_0x5b4e09)return![];const _0x3371c0=_0x5b4e09[_0x40e376(0x12a)]||'';if(!VisuMZ[_0x40e376(0x291)][_0x40e376(0x2ee)](_0x3371c0,_0x3717c6,_0x1ab72d,_0x2d6b20))return![];return!![];},VisuMZ['SkillsStatesCore']['MeetsAuraNoteConditions']=function(_0x3cbe6b,_0x49617c,_0x2c150c,_0x2e934c){const _0x5187d4=_0x2a62ce;_0x3cbe6b=_0x3cbe6b||'';if(_0x2c150c['isDead']()){if(_0x49617c&&_0x3cbe6b[_0x5187d4(0x330)](/<ALLOW DEAD AURA>/i)){}else{if(!_0x49617c&&_0x3cbe6b['match'](/<ALLOW DEAD MIASMA>/i)){}else{if(_0x49617c&&_0x3cbe6b[_0x5187d4(0x330)](/<DEAD AURA ONLY>/i)){}else{if(!_0x49617c&&_0x3cbe6b[_0x5187d4(0x330)](/<DEAD MIASMA ONLY>/i)){}else return![];}}}}else{if(_0x49617c&&_0x3cbe6b[_0x5187d4(0x330)](/<DEAD AURA ONLY>/i))return![];else{if(!_0x49617c&&_0x3cbe6b[_0x5187d4(0x330)](/<DEAD MIASMA ONLY>/i))return![];}}if(_0x49617c){if(_0x3cbe6b[_0x5187d4(0x330)](/<AURA NOT FOR USER>/i)){if(_0x2c150c===_0x2e934c)return![];}else{if(_0x3cbe6b[_0x5187d4(0x330)](/<NOT USER AURA>/i)){if(_0x2c150c===_0x2e934c)return![];}}}return!![];},Game_BattlerBase[_0x2a62ce(0x151)]['stateTurns']=function(_0x58b7b3){const _0x3a1359=_0x2a62ce;if(typeof _0x58b7b3!=='number')_0x58b7b3=_0x58b7b3['id'];return this[_0x3a1359(0xea)][_0x58b7b3]||0x0;},Game_BattlerBase[_0x2a62ce(0x151)]['setStateTurns']=function(_0x276c74,_0x3cbebc){const _0x34e801=_0x2a62ce;if(typeof _0x276c74!=='number')_0x276c74=_0x276c74['id'];if(this['isStateAffected'](_0x276c74)){const _0x540ef7=DataManager['stateMaximumTurns'](_0x276c74);this[_0x34e801(0xea)][_0x276c74]=_0x3cbebc[_0x34e801(0x24d)](0x0,_0x540ef7);if(this['_stateTurns'][_0x276c74]<=0x0)this[_0x34e801(0x109)](_0x276c74);}},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x3b7)]=function(_0x1741e7,_0x364328){const _0x54cbe9=_0x2a62ce;if(typeof _0x1741e7!==_0x54cbe9(0x148))_0x1741e7=_0x1741e7['id'];this['isStateAffected'](_0x1741e7)&&(_0x364328+=this[_0x54cbe9(0x299)](_0x1741e7),this[_0x54cbe9(0x184)](_0x1741e7,_0x364328));},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x24b)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2f0)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2f0)]=function(_0x4fb83c){const _0x1890b4=_0x2a62ce,_0x1a788e=this[_0x1890b4(0x2cf)][_0x4fb83c];VisuMZ['SkillsStatesCore'][_0x1890b4(0x24b)][_0x1890b4(0x107)](this,_0x4fb83c);if(_0x1a788e>0x0)this[_0x1890b4(0x1d0)](_0x4fb83c);if(_0x1a788e<0x0)this['onEraseDebuff'](_0x4fb83c);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x215)]=Game_BattlerBase['prototype'][_0x2a62ce(0x35d)],Game_BattlerBase[_0x2a62ce(0x151)]['increaseBuff']=function(_0x460345){const _0x33b46f=_0x2a62ce;VisuMZ[_0x33b46f(0x291)]['Game_BattlerBase_increaseBuff'][_0x33b46f(0x107)](this,_0x460345);if(!this[_0x33b46f(0x360)](_0x460345))this[_0x33b46f(0x2f0)](_0x460345);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x396)]=Game_BattlerBase['prototype'][_0x2a62ce(0x20e)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x20e)]=function(_0x224470){const _0x9ce574=_0x2a62ce;VisuMZ[_0x9ce574(0x291)][_0x9ce574(0x396)]['call'](this,_0x224470);if(!this['isBuffOrDebuffAffected'](_0x224470))this[_0x9ce574(0x2f0)](_0x224470);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1d0)]=function(_0x1c4a09){},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2a8)]=function(_0x2ae80c){},Game_BattlerBase[_0x2a62ce(0x151)]['isMaxBuffAffected']=function(_0x36e5e7){const _0x17d82a=_0x2a62ce;return this[_0x17d82a(0x2cf)][_0x36e5e7]===VisuMZ[_0x17d82a(0x291)]['Settings'][_0x17d82a(0x14f)][_0x17d82a(0x304)];},Game_BattlerBase['prototype'][_0x2a62ce(0xf5)]=function(_0xf14c85){const _0x21050f=_0x2a62ce;return this['_buffs'][_0xf14c85]===-VisuMZ[_0x21050f(0x291)][_0x21050f(0x22b)]['Buffs'][_0x21050f(0x3ba)];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x21d)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x259)],Game_BattlerBase[_0x2a62ce(0x151)]['buffIconIndex']=function(_0x2e064e,_0x708b7c){const _0x533ae2=_0x2a62ce;return _0x2e064e=_0x2e064e['clamp'](-0x2,0x2),VisuMZ[_0x533ae2(0x291)]['Game_BattlerBase_buffIconIndex'][_0x533ae2(0x107)](this,_0x2e064e,_0x708b7c);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x175)]=function(_0x11c30c){const _0x597f15=_0x2a62ce,_0x28d28c=this[_0x597f15(0x2cf)][_0x11c30c];return VisuMZ[_0x597f15(0x291)][_0x597f15(0x22b)]['Buffs'][_0x597f15(0x319)]['call'](this,_0x11c30c,_0x28d28c);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x38a)]=function(_0x95fa18){const _0x3f3fd3=_0x2a62ce;return this[_0x3f3fd3(0x112)][_0x95fa18]||0x0;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2e9)]=function(_0x1005ba){return this['buffTurns'](_0x1005ba);},Game_BattlerBase['prototype'][_0x2a62ce(0x362)]=function(_0x40650a,_0x267793){const _0x5d2d07=_0x2a62ce;if(this['isBuffAffected'](_0x40650a)){const _0x3ba248=VisuMZ[_0x5d2d07(0x291)][_0x5d2d07(0x22b)][_0x5d2d07(0x14f)][_0x5d2d07(0x136)];this[_0x5d2d07(0x112)][_0x40650a]=_0x267793[_0x5d2d07(0x24d)](0x0,_0x3ba248);}},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x3bb)]=function(_0x52ede8,_0x3f6f7b){const _0x3b5b4c=_0x2a62ce;this[_0x3b5b4c(0x111)](_0x52ede8)&&(_0x3f6f7b+=this['buffTurns'](stateId),this[_0x3b5b4c(0x362)](_0x52ede8,_0x3f6f7b));},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1ff)]=function(_0x3d4513,_0x524831){const _0xcb20fc=_0x2a62ce;if(this[_0xcb20fc(0x2c6)](_0x3d4513)){const _0x1eeb5d=VisuMZ[_0xcb20fc(0x291)]['Settings']['Buffs'][_0xcb20fc(0x136)];this[_0xcb20fc(0x112)][_0x3d4513]=_0x524831[_0xcb20fc(0x24d)](0x0,_0x1eeb5d);}},Game_BattlerBase[_0x2a62ce(0x151)]['addDebuffTurns']=function(_0x4c701a,_0x4235fa){const _0x25201e=_0x2a62ce;this['isDebuffAffected'](_0x4c701a)&&(_0x4235fa+=this[_0x25201e(0x38a)](stateId),this[_0x25201e(0x1ff)](_0x4c701a,_0x4235fa));},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x115)]=function(_0x32fc36){const _0x37be3a=_0x2a62ce;if(typeof _0x32fc36!=='number')_0x32fc36=_0x32fc36['id'];return this[_0x37be3a(0xcc)]=this[_0x37be3a(0xcc)]||{},this[_0x37be3a(0xcc)][_0x32fc36]=this[_0x37be3a(0xcc)][_0x32fc36]||{},this['_stateData'][_0x32fc36];},Game_BattlerBase[_0x2a62ce(0x151)]['getStateData']=function(_0x2e53da,_0x45b27f){const _0x79af1b=_0x2a62ce;if(typeof _0x2e53da!==_0x79af1b(0x148))_0x2e53da=_0x2e53da['id'];const _0x4810e1=this[_0x79af1b(0x115)](_0x2e53da);return _0x4810e1[_0x45b27f];},Game_BattlerBase['prototype'][_0x2a62ce(0x154)]=function(_0x5cb82e,_0x11f462,_0x111561){const _0xae18f5=_0x2a62ce;if(typeof _0x5cb82e!==_0xae18f5(0x148))_0x5cb82e=_0x5cb82e['id'];const _0x52a469=this[_0xae18f5(0x115)](_0x5cb82e);_0x52a469[_0x11f462]=_0x111561;},Game_BattlerBase[_0x2a62ce(0x151)]['clearStateData']=function(_0x57a700){const _0x15c0d2=_0x2a62ce;if(typeof _0x57a700!=='number')_0x57a700=_0x57a700['id'];this['_stateData']=this[_0x15c0d2(0xcc)]||{},this[_0x15c0d2(0xcc)][_0x57a700]={};},Game_BattlerBase[_0x2a62ce(0x151)]['getStateDisplay']=function(_0xcc31db){const _0x1fe449=_0x2a62ce;if(typeof _0xcc31db!=='number')_0xcc31db=_0xcc31db['id'];return this[_0x1fe449(0x29d)]=this['_stateDisplay']||{},this[_0x1fe449(0x29d)][_0xcc31db]===undefined&&(this[_0x1fe449(0x29d)][_0xcc31db]=''),this[_0x1fe449(0x29d)][_0xcc31db];},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1ec)]=function(_0x30a873,_0x389e5f){const _0xabeecd=_0x2a62ce;if(typeof _0x30a873!==_0xabeecd(0x148))_0x30a873=_0x30a873['id'];this[_0xabeecd(0x29d)]=this[_0xabeecd(0x29d)]||{},this[_0xabeecd(0x29d)][_0x30a873]=_0x389e5f;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x390)]=function(_0x34c4e9){const _0x117de6=_0x2a62ce;if(typeof _0x34c4e9!==_0x117de6(0x148))_0x34c4e9=_0x34c4e9['id'];this[_0x117de6(0x29d)]=this[_0x117de6(0x29d)]||{},this[_0x117de6(0x29d)][_0x34c4e9]='';},Game_BattlerBase[_0x2a62ce(0x151)]['getStateOrigin']=function(_0x4a9ae8){const _0x356f93=_0x2a62ce;if(typeof _0x4a9ae8!==_0x356f93(0x148))_0x4a9ae8=_0x4a9ae8['id'];this['_stateOrigin']=this[_0x356f93(0x183)]||{},this[_0x356f93(0x183)][_0x4a9ae8]=this[_0x356f93(0x183)][_0x4a9ae8]||_0x356f93(0x2b8);const _0x219fde=this[_0x356f93(0x183)][_0x4a9ae8];return this[_0x356f93(0x278)](_0x219fde);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x27a)]=function(_0x47ffcf,_0x5409ab){const _0x1be2c2=_0x2a62ce;this['_stateOrigin']=this['_stateOrigin']||{};const _0x51cd7e=_0x5409ab?this[_0x1be2c2(0x25e)](_0x5409ab):this[_0x1be2c2(0xb0)]();this[_0x1be2c2(0x183)][_0x47ffcf]=_0x51cd7e;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x35f)]=function(_0xccf84b){const _0x26652c=_0x2a62ce;this[_0x26652c(0x183)]=this[_0x26652c(0x183)]||{},delete this[_0x26652c(0x183)][_0xccf84b];},Game_BattlerBase['prototype'][_0x2a62ce(0x2aa)]=function(){const _0x5a8ada=_0x2a62ce;this[_0x5a8ada(0x183)]={};},Game_BattlerBase['prototype']['getCurrentStateOriginKey']=function(){const _0x4458a5=_0x2a62ce,_0x2bfee0=this['getCurrentStateActiveUser']();return this[_0x4458a5(0x25e)](_0x2bfee0);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x261)]=function(){const _0x3e6dcf=_0x2a62ce;if($gameParty[_0x3e6dcf(0x322)]()){if(BattleManager['_subject'])return BattleManager[_0x3e6dcf(0x196)];else{if(BattleManager[_0x3e6dcf(0x2cd)])return BattleManager['_currentActor'];}}else{const _0x19306a=SceneManager[_0x3e6dcf(0x22c)];if(![Scene_Map,Scene_Item][_0x3e6dcf(0x336)](_0x19306a['constructor']))return $gameParty[_0x3e6dcf(0x2ad)]();}return this;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x25e)]=function(_0x33649a){const _0x43efd0=_0x2a62ce;if(!_0x33649a)return _0x43efd0(0x2b8);if(_0x33649a[_0x43efd0(0x143)]())return _0x43efd0(0x227)[_0x43efd0(0x1dc)](_0x33649a['actorId']());else{const _0x24cb75=_0x43efd0(0x3c3)[_0x43efd0(0x1dc)](_0x33649a[_0x43efd0(0x231)]()),_0x3caf4b=_0x43efd0(0x2e4)[_0x43efd0(0x1dc)](_0x33649a[_0x43efd0(0x377)]()),_0x304e8c='<troop-%1>'[_0x43efd0(0x1dc)]($gameTroop[_0x43efd0(0x28f)]());return _0x43efd0(0xe5)['format'](_0x24cb75,_0x3caf4b,_0x304e8c);}return _0x43efd0(0x2b8);},Game_BattlerBase[_0x2a62ce(0x151)]['getStateOriginByKey']=function(_0x302ad3){const _0x226492=_0x2a62ce;if(_0x302ad3===_0x226492(0x2b8))return this;else{if(_0x302ad3['match'](/<actor-(\d+)>/i))return $gameActors['actor'](Number(RegExp['$1']));else{if($gameParty[_0x226492(0x322)]()&&_0x302ad3[_0x226492(0x330)](/<troop-(\d+)>/i)){const _0x1d3414=Number(RegExp['$1']);if(_0x1d3414===$gameTroop[_0x226492(0x28f)]()){if(_0x302ad3[_0x226492(0x330)](/<member-(\d+)>/i))return $gameTroop[_0x226492(0x32a)]()[Number(RegExp['$1'])];}}if(_0x302ad3[_0x226492(0x330)](/<enemy-(\d+)>/i))return new Game_Enemy(Number(RegExp['$1']),-0x1f4,-0x1f4);}}return this;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1a8)]=function(_0x1e000e){const _0x3470f0=_0x2a62ce;if(!_0x1e000e)return![];if(this[_0x3470f0(0x14d)]())return!![];this[_0x3470f0(0x1dd)]=this[_0x3470f0(0x1dd)]||{};if(this[_0x3470f0(0x1dd)][_0x1e000e['id']]===undefined){this[_0x3470f0(0x143)]()?this[_0x3470f0(0x1dd)][_0x1e000e['id']]=DataManager[_0x3470f0(0x257)](_0x1e000e):this['_skillToggle'][_0x1e000e['id']]=!![];if(this['_skillToggle'][_0x1e000e['id']]&&DataManager[_0x3470f0(0x130)](_0x1e000e)[_0x3470f0(0x121)]>0x0){const _0x4d8d12=DataManager[_0x3470f0(0x130)](_0x1e000e),_0x8a5528=this[_0x3470f0(0xef)]()[_0x3470f0(0x240)](_0x277823=>_0x277823!==_0x1e000e)[_0x3470f0(0x240)](_0x1e5437=>DataManager[_0x3470f0(0x35a)](_0x1e5437))[_0x3470f0(0x240)](_0x3b54b5=>DataManager[_0x3470f0(0x130)](_0x3b54b5)[_0x3470f0(0x226)](_0x540225=>_0x4d8d12[_0x3470f0(0x336)](_0x540225)));_0x8a5528[_0x3470f0(0x121)]>0x0&&(this[_0x3470f0(0x1dd)][_0x1e000e['id']]=![]);}if(this[_0x3470f0(0x1dd)][_0x1e000e['id']]){this[_0x3470f0(0x287)](),$gameParty[_0x3470f0(0x358)]();if($gameParty['inBattle']())$gameTroop[_0x3470f0(0x358)]();}}return this[_0x3470f0(0x1dd)][_0x1e000e['id']];},Game_BattlerBase[_0x2a62ce(0x151)]['setSkillToggle']=function(_0x148d09,_0x402b32){const _0x3ef835=_0x2a62ce;if(!DataManager['isToggleSkill'](_0x148d09))return;if(this[_0x3ef835(0x14d)]())return;this[_0x3ef835(0x1dd)]=this[_0x3ef835(0x1dd)]||{};if(_0x402b32&&DataManager[_0x3ef835(0x130)](_0x148d09)[_0x3ef835(0x121)]>0x0){const _0x38c6ed=DataManager[_0x3ef835(0x130)](_0x148d09),_0x349390=this[_0x3ef835(0xef)]()['filter'](_0x10d93e=>DataManager['isToggleSkill'](_0x10d93e))['filter'](_0x36378f=>DataManager[_0x3ef835(0x130)](_0x36378f)[_0x3ef835(0x226)](_0x5acd8f=>_0x38c6ed[_0x3ef835(0x336)](_0x5acd8f)));for(const _0xca6abb of _0x349390){if(!_0xca6abb)continue;this['_skillToggle'][_0xca6abb['id']]=![];}}this[_0x3ef835(0x1dd)][_0x148d09['id']]=_0x402b32,this[_0x3ef835(0x287)](),$gameParty['refreshAllMembers']();if($gameParty[_0x3ef835(0x322)]())$gameTroop[_0x3ef835(0x358)]();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x29b)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2d5)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x2d5)]=function(_0x199eb3){const _0x27e5eb=_0x2a62ce;if(DataManager[_0x27e5eb(0x35a)](_0x199eb3)){if(this[_0x27e5eb(0x143)]()){if($gameParty[_0x27e5eb(0x322)]()){if(this[_0x27e5eb(0x32e)]())return![];if(this[_0x27e5eb(0x38d)]())return![];}if(this[_0x27e5eb(0x1a8)](_0x199eb3))return!![];}else return![];}return VisuMZ[_0x27e5eb(0x291)][_0x27e5eb(0x29b)]['call'](this,_0x199eb3);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x17a)]=Game_Action['prototype']['isValid'],Game_Action[_0x2a62ce(0x151)]['isValid']=function(){const _0x3c726c=_0x2a62ce;if(DataManager['isToggleSkill'](this['item']()))return![];return VisuMZ['SkillsStatesCore']['Game_Action_isValid'][_0x3c726c(0x107)](this);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x1a2)]=Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x1da)],Game_Battler[_0x2a62ce(0x151)]['addState']=function(_0x5886a1){const _0x599e91=_0x2a62ce,_0x4fa07b=this[_0x599e91(0x1b5)](_0x5886a1);VisuMZ[_0x599e91(0x291)][_0x599e91(0x1a2)]['call'](this,_0x5886a1);if(_0x4fa07b&&this[_0x599e91(0x37d)]($dataStates[_0x5886a1])){this[_0x599e91(0x149)](_0x5886a1);;}},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x1a5)]=Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x1b5)],Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x1b5)]=function(_0x168b51){const _0x2f54cf=_0x2a62ce,_0x2ecabf=$dataStates[_0x168b51];if(_0x2ecabf&&_0x2ecabf['note'][_0x2f54cf(0x330)](/<NO DEATH CLEAR>/i))return!this[_0x2f54cf(0x1af)](_0x168b51)&&!this[_0x2f54cf(0x309)](_0x168b51)&&!this[_0x2f54cf(0x141)][_0x2f54cf(0x120)](_0x168b51);return VisuMZ[_0x2f54cf(0x291)][_0x2f54cf(0x1a5)][_0x2f54cf(0x107)](this,_0x168b51);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xed)]=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1d6)],Game_BattlerBase[_0x2a62ce(0x151)]['addNewState']=function(_0x4a2d04){const _0x23b7b7=_0x2a62ce;VisuMZ[_0x23b7b7(0x291)][_0x23b7b7(0xed)][_0x23b7b7(0x107)](this,_0x4a2d04);if(_0x4a2d04===this[_0x23b7b7(0x398)]())while(this[_0x23b7b7(0x174)]['filter'](_0x4fb1b8=>_0x4fb1b8===this[_0x23b7b7(0x398)]())[_0x23b7b7(0x121)]>0x1){const _0x4aae64=this[_0x23b7b7(0x174)][_0x23b7b7(0x297)](this['deathStateId']());this[_0x23b7b7(0x174)][_0x23b7b7(0x277)](_0x4aae64,0x1);}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x149)]=function(_0x1211c7){const _0x1c01df=_0x2a62ce;this[_0x1c01df(0x27a)](_0x1211c7),this[_0x1c01df(0x30e)](_0x1211c7),this['onAddStateMakeCustomSlipValues'](_0x1211c7),this[_0x1c01df(0x34c)](_0x1211c7),this[_0x1c01df(0x381)](_0x1211c7);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x283)]=function(_0x2ecd8c){const _0x576558=_0x2a62ce;this[_0x576558(0x32f)](_0x2ecd8c),this[_0x576558(0xe4)](_0x2ecd8c),Game_BattlerBase['prototype']['onRemoveState'][_0x576558(0x107)](this,_0x2ecd8c);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0xd5)]=function(_0x2aef9c){const _0x20b5cc=_0x2a62ce;for(const _0x32b2b0 of this[_0x20b5cc(0x1a4)]()){this['isStateExpired'](_0x32b2b0['id'])&&_0x32b2b0[_0x20b5cc(0x223)]===_0x2aef9c&&(this[_0x20b5cc(0x109)](_0x32b2b0['id']),this['onExpireState'](_0x32b2b0['id']),this[_0x20b5cc(0x3bf)](_0x32b2b0['id']));}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x393)]=function(_0x77115a){const _0x1040fe=_0x2a62ce;this[_0x1040fe(0x258)](_0x77115a);},Game_Battler['prototype']['onAddStateCustomJS']=function(_0x1c58af){const _0x3cb5d5=_0x2a62ce;if(this[_0x3cb5d5(0x26e)]||this['_tempBattler'])return;const _0x369695=VisuMZ[_0x3cb5d5(0x291)]['stateAddJS'];if(_0x369695[_0x1c58af])_0x369695[_0x1c58af][_0x3cb5d5(0x107)](this,_0x1c58af);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x32f)]=function(_0x34b3ba){const _0x51c7e1=_0x2a62ce;if(this['_tempActor']||this[_0x51c7e1(0x30c)])return;const _0x2f1935=VisuMZ[_0x51c7e1(0x291)]['stateEraseJS'];if(_0x2f1935[_0x34b3ba])_0x2f1935[_0x34b3ba]['call'](this,_0x34b3ba);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x258)]=function(_0x143b0f){const _0xae30c8=_0x2a62ce;if(this[_0xae30c8(0x26e)]||this[_0xae30c8(0x30c)])return;const _0xe14e94=VisuMZ['SkillsStatesCore'][_0xae30c8(0x292)];if(_0xe14e94[_0x143b0f])_0xe14e94[_0x143b0f][_0xae30c8(0x107)](this,_0x143b0f);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x381)]=function(_0x420ec2){const _0x17c126=_0x2a62ce;if(this[_0x17c126(0x26e)]||this['_tempBattler'])return;try{VisuMZ[_0x17c126(0x291)]['Settings'][_0x17c126(0x39a)][_0x17c126(0xdb)][_0x17c126(0x107)](this,_0x420ec2);}catch(_0x4c0607){if($gameTemp[_0x17c126(0x33b)]())console['log'](_0x4c0607);}},Game_Battler[_0x2a62ce(0x151)]['onEraseStateGlobalJS']=function(_0x1fcab1){const _0x2b7e8f=_0x2a62ce;if(this[_0x2b7e8f(0x26e)]||this[_0x2b7e8f(0x30c)])return;try{VisuMZ[_0x2b7e8f(0x291)][_0x2b7e8f(0x22b)][_0x2b7e8f(0x39a)][_0x2b7e8f(0x37e)][_0x2b7e8f(0x107)](this,_0x1fcab1);}catch(_0xd5a50c){if($gameTemp[_0x2b7e8f(0x33b)]())console[_0x2b7e8f(0x135)](_0xd5a50c);}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x3bf)]=function(_0x180db0){const _0x3929a4=_0x2a62ce;if(this[_0x3929a4(0x26e)]||this[_0x3929a4(0x30c)])return;try{VisuMZ['SkillsStatesCore'][_0x3929a4(0x22b)]['States'][_0x3929a4(0x205)][_0x3929a4(0x107)](this,_0x180db0);}catch(_0x50bee9){if($gameTemp[_0x3929a4(0x33b)]())console[_0x3929a4(0x135)](_0x50bee9);}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x1f9)]=function(_0x4d640d){const _0x361809=_0x2a62ce;return _0x4d640d=_0x4d640d[_0x361809(0x2f9)]()[_0x361809(0x2dc)](),this[_0x361809(0x1a4)]()[_0x361809(0x240)](_0x55b569=>_0x55b569['categories'][_0x361809(0x336)](_0x4d640d));},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x36f)]=function(_0x5922a9,_0x195357){const _0xd11340=_0x2a62ce;_0x5922a9=_0x5922a9[_0xd11340(0x2f9)]()[_0xd11340(0x2dc)](),_0x195357=_0x195357||0x0;const _0x2e56c6=this[_0xd11340(0x1f9)](_0x5922a9),_0x34424c=[];for(const _0x160321 of _0x2e56c6){if(!_0x160321)continue;if(_0x195357<=0x0)break;_0x34424c['push'](_0x160321['id']),this['_result'][_0xd11340(0x281)]=!![],_0x195357--;}while(_0x34424c[_0xd11340(0x121)]>0x0){this[_0xd11340(0x109)](_0x34424c[_0xd11340(0x27c)]());}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x347)]=function(_0x301ad3,_0xf9279d){const _0xe83041=_0x2a62ce;_0x301ad3=_0x301ad3[_0xe83041(0x2f9)]()[_0xe83041(0x2dc)](),_0xf9279d=_0xf9279d||[];const _0x2bf2f1=this[_0xe83041(0x1f9)](_0x301ad3),_0x165506=[];for(const _0x4246ab of _0x2bf2f1){if(!_0x4246ab)continue;if(_0xf9279d[_0xe83041(0x336)](_0x4246ab))continue;_0x165506[_0xe83041(0x27e)](_0x4246ab['id']),this[_0xe83041(0x141)][_0xe83041(0x281)]=!![];}while(_0x165506[_0xe83041(0x121)]>0x0){this[_0xe83041(0x109)](_0x165506[_0xe83041(0x27c)]());}},Game_Battler['prototype']['isStateCategoryAffected']=function(_0x4daba9){const _0x50a42a=_0x2a62ce;return this[_0x50a42a(0x163)](_0x4daba9)>0x0;},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x3a5)]=function(_0x265182){const _0x333b7b=_0x2a62ce;return this[_0x333b7b(0x2c1)](_0x265182)>0x0;},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x163)]=function(_0x3722ea){const _0x33c41a=_0x2a62ce,_0x37afa2=this[_0x33c41a(0x1f9)](_0x3722ea)[_0x33c41a(0x240)](_0x4b0158=>this[_0x33c41a(0x210)](_0x4b0158['id']));return _0x37afa2[_0x33c41a(0x121)];},Game_Battler[_0x2a62ce(0x151)]['totalStateCategory']=function(_0x3cc92f){const _0x5abb4a=this['statesByCategory'](_0x3cc92f);return _0x5abb4a['length'];},VisuMZ['SkillsStatesCore']['Game_BattlerBase_isStateResist']=Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1af)],Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1af)]=function(_0x5819e7){const _0x203f87=_0x2a62ce,_0x26c9a3=$dataStates[_0x5819e7];if(_0x26c9a3&&_0x26c9a3['categories'][_0x203f87(0x121)]>0x0)for(const _0x124f67 of _0x26c9a3[_0x203f87(0x235)]){if(this[_0x203f87(0x1a0)](_0x124f67))return!![];}return VisuMZ[_0x203f87(0x291)][_0x203f87(0x105)]['call'](this,_0x5819e7);},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x1a0)]=function(_0x309dfe){const _0x1a8bab=_0x2a62ce;let _0x1130e8=_0x1a8bab(0xc3);if(this[_0x1a8bab(0x242)](_0x1130e8))return this[_0x1a8bab(0x124)][_0x1130e8][_0x1a8bab(0x336)](_0x309dfe);return this['_cache'][_0x1130e8]=this[_0x1a8bab(0xc8)](),this[_0x1a8bab(0x124)][_0x1130e8][_0x1a8bab(0x336)](_0x309dfe);},Game_BattlerBase[_0x2a62ce(0x151)]['makeResistedStateCategories']=function(){const _0x1a9fe2=_0x2a62ce,_0x140e4b=/<RESIST STATE (?:CATEGORY|CATEGORIES):[ ](.*)>/gi,_0x98343d=/<RESIST STATE (?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/RESIST STATE (?:CATEGORY|CATEGORIES)>/i;let _0x52c288=[];for(const _0x1abd0c of this[_0x1a9fe2(0x191)]()){if(!_0x1abd0c)continue;const _0x38faec=_0x1abd0c[_0x1a9fe2(0x12a)],_0x42091c=_0x38faec[_0x1a9fe2(0x330)](_0x140e4b);if(_0x42091c)for(const _0x320261 of _0x42091c){_0x320261['match'](_0x140e4b);const _0x23adbc=String(RegExp['$1'])['split'](',')['map'](_0x2c98a9=>String(_0x2c98a9)['toUpperCase']()[_0x1a9fe2(0x2dc)]());_0x52c288=_0x52c288[_0x1a9fe2(0x114)](_0x23adbc);}if(_0x38faec['match'](_0x98343d)){const _0x4898af=String(RegExp['$1'])[_0x1a9fe2(0x181)](/[\r\n]+/)[_0x1a9fe2(0xcf)](_0x21b397=>String(_0x21b397)[_0x1a9fe2(0x2f9)]()[_0x1a9fe2(0x2dc)]());_0x52c288=_0x52c288[_0x1a9fe2(0x114)](_0x4898af);}}return _0x52c288;},Game_BattlerBase[_0x2a62ce(0x151)][_0x2a62ce(0x30e)]=function(_0x137935){const _0x5b5be3=_0x2a62ce,_0x257440=$dataStates[_0x137935];if(!_0x257440)return;const _0x365911=_0x257440[_0x5b5be3(0x12a)]||'',_0x40e79e=_0x365911[_0x5b5be3(0x330)](/<REMOVE OTHER (.*) STATES>/gi);if(_0x40e79e){const _0x20a0cd=[_0x257440];for(const _0x2d3299 of _0x40e79e){_0x2d3299[_0x5b5be3(0x330)](/<REMOVE OTHER (.*) STATES>/i);const _0x2cffb5=String(RegExp['$1']);this[_0x5b5be3(0x347)](_0x2cffb5,_0x20a0cd);}}},Game_Battler['prototype'][_0x2a62ce(0x1e5)]=function(){const _0x460a3b=_0x2a62ce;for(const _0x4fa5f0 of this[_0x460a3b(0x1a4)]()){if(!_0x4fa5f0)continue;if(!this[_0x460a3b(0x210)](_0x4fa5f0['id']))continue;if(!_0x4fa5f0[_0x460a3b(0x26f)])continue;if(this['bypassRemoveStatesByDamage'](_0x4fa5f0))continue;Math[_0x460a3b(0x20f)](0x64)<_0x4fa5f0['chanceByDamage']&&this['removeState'](_0x4fa5f0['id']);}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2f5)]=Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x397)],Game_Action[_0x2a62ce(0x151)][_0x2a62ce(0x397)]=function(_0x5e035d,_0x5dc9bc){const _0x1930ff=_0x2a62ce;$gameTemp[_0x1930ff(0x262)]=this[_0x1930ff(0xd6)](),$gameTemp['_bypassRemoveStateDamage_user']=this[_0x1930ff(0x26d)](),$gameTemp['_bypassRemoveStateDamage_value']=_0x5dc9bc,VisuMZ[_0x1930ff(0x291)][_0x1930ff(0x2f5)][_0x1930ff(0x107)](this,_0x5e035d,_0x5dc9bc),$gameTemp[_0x1930ff(0x262)]=undefined,$gameTemp[_0x1930ff(0x19e)]=undefined,$gameTemp[_0x1930ff(0x1d2)]=undefined;},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x263)]=function(_0x442485){const _0x14fcf7=_0x2a62ce;if($gameTemp[_0x14fcf7(0x262)]){const _0xbfb180=$gameTemp[_0x14fcf7(0x262)],_0x145d29=/<BYPASS STATE DAMAGE REMOVAL:[ ](.*)>/gi;if(DataManager[_0x14fcf7(0x363)](_0x442485,_0xbfb180,_0x145d29,'action'))return!![];}if($gameTemp['_bypassRemoveStateDamage_user']){const _0x2c3388=$gameTemp[_0x14fcf7(0x19e)];if(_0x2c3388[_0x14fcf7(0x3c6)](_0x442485))return!![];}if(this[_0x14fcf7(0xee)](_0x442485))return!![];return![];},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x3c6)]=function(_0x42117e){const _0x4f8329=_0x2a62ce,_0x516245=/<BYPASS STATE DAMAGE REMOVAL AS (?:ATTACKER|USER):[ ](.*)>/gi;for(const _0x47f05c of this[_0x4f8329(0x191)]()){if(!_0x47f05c)continue;if(DataManager[_0x4f8329(0x363)](_0x42117e,_0x47f05c,_0x516245,_0x4f8329(0x279)))return!![];}return![];},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0xee)]=function(_0x32f0b1){const _0x320d40=_0x2a62ce,_0x54dc75=/<BYPASS STATE DAMAGE REMOVAL AS (?:TARGET|VICTIM):[ ](.*)>/gi;for(const _0x4736b4 of this[_0x320d40(0x191)]()){if(!_0x4736b4)continue;if(DataManager['CheckBypassRemoveStatesByDamage'](_0x32f0b1,_0x4736b4,_0x54dc75,_0x320d40(0x332)))return!![];}return![];},DataManager['CheckBypassRemoveStatesByDamage']=function(_0x2869a0,_0x110c97,_0x339676,_0x56c72d){const _0x163eb1=_0x2a62ce,_0x4ae439='%1-%2-%3'['format'](_0x110c97[_0x163eb1(0x1f2)],_0x110c97['id'],_0x56c72d);this[_0x163eb1(0x305)]=this['_cache_CheckBypassRemoveStatesByDamage']||{};if(this[_0x163eb1(0x305)][_0x4ae439]!==undefined)return this[_0x163eb1(0x305)][_0x4ae439][_0x163eb1(0x336)](_0x2869a0['id']);const _0x3b9a81=[],_0x102ce7=_0x110c97['note'][_0x163eb1(0x330)](_0x339676);if(_0x102ce7)for(const _0x2843bd of _0x102ce7){_0x2843bd[_0x163eb1(0x330)](_0x339676);const _0x2e862b=String(RegExp['$1'])[_0x163eb1(0x181)](',')[_0x163eb1(0xcf)](_0x3cb99b=>_0x3cb99b[_0x163eb1(0x2dc)]());for(let _0x48f49b of _0x2e862b){_0x48f49b=(String(_0x48f49b)||'')[_0x163eb1(0x2dc)]();if(_0x48f49b[_0x163eb1(0x330)](/(\d+)[ ](?:THROUGH|to)[ ](\d+)/i)){const _0x4a9b8b=Math[_0x163eb1(0x316)](Number(RegExp['$1']),Number(RegExp['$2'])),_0x3addfe=Math[_0x163eb1(0x34e)](Number(RegExp['$1']),Number(RegExp['$2']));for(let _0x2c0941=_0x4a9b8b;_0x2c0941<=_0x3addfe;_0x2c0941++)elements[_0x163eb1(0x27e)](_0x2c0941);continue;}const _0x357752=/^\d+$/[_0x163eb1(0x22e)](_0x48f49b);_0x357752?entryID=Number(_0x48f49b):entryID=DataManager[_0x163eb1(0x2b9)](_0x48f49b),entryID&&_0x3b9a81[_0x163eb1(0x27e)](entryID);}}return this[_0x163eb1(0x305)][_0x4ae439]=_0x3b9a81,this['_cache_CheckBypassRemoveStatesByDamage'][_0x4ae439][_0x163eb1(0x336)](_0x2869a0['id']);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3c4)]=Game_Battler[_0x2a62ce(0x151)]['addBuff'],Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x290)]=function(_0x75b3a7,_0x3ae399){const _0x42fb74=_0x2a62ce;VisuMZ['SkillsStatesCore'][_0x42fb74(0x3c4)]['call'](this,_0x75b3a7,_0x3ae399),this[_0x42fb74(0x111)](_0x75b3a7)&&this['onAddBuff'](_0x75b3a7,_0x3ae399);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x1e3)]=function(_0x1e145a){},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x37a)]=Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x2b0)],Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x2b0)]=function(_0x59d1bf,_0x591b83){const _0x464203=_0x2a62ce;VisuMZ[_0x464203(0x291)][_0x464203(0x37a)][_0x464203(0x107)](this,_0x59d1bf,_0x591b83),this[_0x464203(0x2c6)](_0x59d1bf)&&this[_0x464203(0xcb)](_0x59d1bf,_0x591b83);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x300)]=function(){const _0x3fdfdf=_0x2a62ce;for(let _0x489b77=0x0;_0x489b77<this[_0x3fdfdf(0x321)]();_0x489b77++){if(this[_0x3fdfdf(0x3ca)](_0x489b77)){const _0x474b0e=this[_0x3fdfdf(0x2cf)][_0x489b77];this['removeBuff'](_0x489b77);if(_0x474b0e>0x0)this['onExpireBuff'](_0x489b77);if(_0x474b0e<0x0)this['onExpireDebuff'](_0x489b77);}}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x2ab)]=function(_0x402d0d,_0x5a7dcb){const _0x34c064=_0x2a62ce;this[_0x34c064(0x2a9)](_0x402d0d,_0x5a7dcb);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0xcb)]=function(_0x4cefc5,_0x2e0a87){const _0x5e33be=_0x2a62ce;this[_0x5e33be(0x326)](_0x4cefc5,_0x2e0a87);},Game_Battler[_0x2a62ce(0x151)]['onEraseBuff']=function(_0x1413a0){const _0x5550eb=_0x2a62ce;Game_BattlerBase['prototype'][_0x5550eb(0x1d0)][_0x5550eb(0x107)](this,_0x1413a0),this[_0x5550eb(0x17c)](_0x1413a0);},Game_Battler['prototype'][_0x2a62ce(0x2a8)]=function(_0x5a0da5){const _0x5971c1=_0x2a62ce;Game_BattlerBase['prototype'][_0x5971c1(0x2a8)]['call'](this,_0x5a0da5),this['onEraseDebuffGlobalJS'](_0x5a0da5);},Game_Battler[_0x2a62ce(0x151)]['onExpireBuff']=function(_0x33096d){this['onExpireBuffGlobalJS'](_0x33096d);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x338)]=function(_0x16e040){const _0x429066=_0x2a62ce;this[_0x429066(0xd4)](_0x16e040);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x2a9)]=function(_0x4a4c9d,_0x32a1e2){const _0x1b9948=_0x2a62ce;VisuMZ[_0x1b9948(0x291)]['Settings']['Buffs'][_0x1b9948(0xd3)]['call'](this,_0x4a4c9d,_0x32a1e2);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x326)]=function(_0x22b303,_0x2bcdf8){const _0x6fdfb6=_0x2a62ce;VisuMZ[_0x6fdfb6(0x291)][_0x6fdfb6(0x22b)][_0x6fdfb6(0x14f)][_0x6fdfb6(0x16b)][_0x6fdfb6(0x107)](this,_0x22b303,_0x2bcdf8);},Game_BattlerBase['prototype']['onEraseBuffGlobalJS']=function(_0x1ab1a7){const _0x4dcab4=_0x2a62ce;VisuMZ[_0x4dcab4(0x291)][_0x4dcab4(0x22b)]['Buffs'][_0x4dcab4(0x185)][_0x4dcab4(0x107)](this,_0x1ab1a7);},Game_BattlerBase['prototype'][_0x2a62ce(0x2de)]=function(_0x107c83){const _0x565c25=_0x2a62ce;VisuMZ[_0x565c25(0x291)][_0x565c25(0x22b)]['Buffs'][_0x565c25(0x167)][_0x565c25(0x107)](this,_0x107c83);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x268)]=function(_0x500c94){const _0x13a39a=_0x2a62ce;VisuMZ['SkillsStatesCore']['Settings'][_0x13a39a(0x14f)][_0x13a39a(0x351)][_0x13a39a(0x107)](this,_0x500c94);},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0xd4)]=function(_0x403be4){const _0x21a693=_0x2a62ce;VisuMZ[_0x21a693(0x291)][_0x21a693(0x22b)]['Buffs']['onExpireDebuffJS'][_0x21a693(0x107)](this,_0x403be4);},Game_Battler['prototype'][_0x2a62ce(0x21e)]=function(_0x78c76a){const _0x4c24fc=_0x2a62ce,_0x9a44ed=VisuMZ[_0x4c24fc(0x291)],_0x57ba63=[_0x4c24fc(0x1df),_0x4c24fc(0x158),_0x4c24fc(0x2c8),_0x4c24fc(0x3ae),_0x4c24fc(0x10b),_0x4c24fc(0xbf)];for(const _0x14bed5 of _0x57ba63){_0x9a44ed[_0x14bed5][_0x78c76a]&&_0x9a44ed[_0x14bed5][_0x78c76a][_0x4c24fc(0x107)](this,_0x78c76a);}},VisuMZ[_0x2a62ce(0x291)]['Game_Battler_regenerateAll']=Game_Battler[_0x2a62ce(0x151)]['regenerateAll'],Game_Battler['prototype']['regenerateAll']=function(){const _0x266418=_0x2a62ce;this['recalculateSlipDamageJS'](),VisuMZ[_0x266418(0x291)][_0x266418(0x3a9)][_0x266418(0x107)](this),this['setPassiveStateSlipDamageJS'](),this['regenerateAllSkillsStatesCore']();},Game_Battler['prototype'][_0x2a62ce(0x372)]=function(){const _0x2551fc=_0x2a62ce;for(const _0x5032eb of this[_0x2551fc(0xc9)]()){if(!_0x5032eb)continue;this[_0x2551fc(0x21e)](_0x5032eb['id']);}},Game_Battler['prototype'][_0x2a62ce(0x1ed)]=function(){const _0x6956be=_0x2a62ce;for(const _0x1727e0 of this[_0x6956be(0x1a4)]()){if(!_0x1727e0)continue;_0x1727e0[_0x6956be(0x12a)]['match'](/<JS SLIP REFRESH>/i)&&this[_0x6956be(0x21e)](_0x1727e0['id']);}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x159)]=function(){const _0x24f8fe=_0x2a62ce;if(!this[_0x24f8fe(0x165)]())return;const _0x36b202=this[_0x24f8fe(0x1a4)]();for(const _0x24bd09 of _0x36b202){if(!_0x24bd09)continue;this[_0x24f8fe(0x131)](_0x24bd09);}},Game_Battler[_0x2a62ce(0x151)][_0x2a62ce(0x131)]=function(_0x3410af){const _0x3d7657=_0x2a62ce,_0x4937ed=this[_0x3d7657(0x1c5)](_0x3410af['id'],'slipHp')||0x0,_0x101995=-this[_0x3d7657(0x1bc)](),_0x521562=Math[_0x3d7657(0x34e)](_0x4937ed,_0x101995);if(_0x521562!==0x0){const _0x16f22c=this[_0x3d7657(0x141)]['hpDamage']||0x0;this[_0x3d7657(0xce)](_0x521562),this[_0x3d7657(0x141)]['hpDamage']+=_0x16f22c;}const _0x36b309=this[_0x3d7657(0x1c5)](_0x3410af['id'],_0x3d7657(0x137))||0x0;if(_0x36b309!==0x0){const _0x22ccd8=this[_0x3d7657(0x141)]['mpDamage']||0x0;this[_0x3d7657(0x39f)](_0x36b309),this[_0x3d7657(0x141)][_0x3d7657(0x2c3)]+=_0x22ccd8;}const _0x5b3118=this[_0x3d7657(0x1c5)](_0x3410af['id'],_0x3d7657(0x253))||0x0;_0x5b3118!==0x0&&this[_0x3d7657(0x387)](_0x5b3118);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x361)]=Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x2f4)],Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x2f4)]=function(){const _0x494cd3=_0x2a62ce,_0x42a173=VisuMZ[_0x494cd3(0x291)]['Game_Actor_skillTypes'][_0x494cd3(0x107)](this),_0x3d1e43=VisuMZ[_0x494cd3(0x291)]['Settings'][_0x494cd3(0x314)];let _0x21ed99=_0x3d1e43[_0x494cd3(0x1cb)];return $gameParty[_0x494cd3(0x322)]()&&(_0x21ed99=_0x21ed99[_0x494cd3(0x114)](_0x3d1e43[_0x494cd3(0x31a)])),_0x42a173[_0x494cd3(0x240)](_0x332980=>!_0x21ed99[_0x494cd3(0x336)](_0x332980));},Game_Actor['prototype'][_0x2a62ce(0x274)]=function(){const _0x33b4eb=_0x2a62ce;return this['skills']()['filter'](_0x3641af=>this[_0x33b4eb(0x284)](_0x3641af));},Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x284)]=function(_0x1f76c3){const _0x49beb5=_0x2a62ce;if(!this[_0x49beb5(0x1cc)](_0x1f76c3))return![];if(!_0x1f76c3)return![];if(!this['isSkillTypeMatchForUse'](_0x1f76c3))return![];if(this[_0x49beb5(0x378)](_0x1f76c3))return![];return!![];},Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x2fc)]=function(_0x287180){const _0x594dbc=_0x2a62ce,_0x692215=this['skillTypes'](),_0x596f6e=DataManager[_0x594dbc(0x1d3)](_0x287180),_0x37caed=_0x692215[_0x594dbc(0x240)](_0x1e1557=>_0x596f6e[_0x594dbc(0x336)](_0x1e1557));return _0x37caed[_0x594dbc(0x121)]>0x0;},Game_Actor['prototype']['isSkillHidden']=function(_0x266c82){const _0x27ae8c=_0x2a62ce;if(!VisuMZ[_0x27ae8c(0x291)][_0x27ae8c(0x28c)](this,_0x266c82))return!![];if(!VisuMZ[_0x27ae8c(0x291)][_0x27ae8c(0x25d)](this,_0x266c82))return!![];if(!VisuMZ[_0x27ae8c(0x291)][_0x27ae8c(0xdd)](this,_0x266c82))return!![];return![];},Game_Actor['prototype'][_0x2a62ce(0x1c0)]=function(){const _0x22d301=_0x2a62ce;let _0x350a75=[this[_0x22d301(0x1a3)](),this[_0x22d301(0x285)]()];_0x350a75=_0x350a75[_0x22d301(0x114)](this[_0x22d301(0x320)]()['filter'](_0x483f4f=>_0x483f4f));for(const _0x5b5741 of this[_0x22d301(0x1f1)]){const _0x497a3f=$dataSkills[_0x5b5741];if(!_0x497a3f)continue;if(DataManager[_0x22d301(0x35a)](_0x497a3f)){if(!this['isSkillToggled'](_0x497a3f))continue;}_0x350a75[_0x22d301(0x27e)](_0x497a3f);}return _0x350a75;},Game_Actor['prototype']['addPassiveStatesByPluginParameters']=function(){const _0x5e153a=_0x2a62ce;Game_Battler['prototype'][_0x5e153a(0x333)][_0x5e153a(0x107)](this);const _0x4726d1=VisuMZ[_0x5e153a(0x291)][_0x5e153a(0x22b)][_0x5e153a(0x128)]['Actor'];this[_0x5e153a(0x124)]['passiveStates']=this['_cache'][_0x5e153a(0xc9)][_0x5e153a(0x114)](_0x4726d1);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x18e)]=Game_Actor[_0x2a62ce(0x151)]['learnSkill'],Game_Actor['prototype'][_0x2a62ce(0x3be)]=function(_0x5dd981){const _0x228f47=_0x2a62ce;VisuMZ[_0x228f47(0x291)][_0x228f47(0x18e)][_0x228f47(0x107)](this,_0x5dd981),this[_0x228f47(0x124)]={},this[_0x228f47(0xc9)]();},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x16e)]=Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x23b)],Game_Actor['prototype']['forgetSkill']=function(_0xe1ec8f){const _0x509ed2=_0x2a62ce;VisuMZ[_0x509ed2(0x291)][_0x509ed2(0x16e)][_0x509ed2(0x107)](this,_0xe1ec8f),this[_0x509ed2(0x124)]={},this[_0x509ed2(0xc9)]();},Game_Actor[_0x2a62ce(0x151)][_0x2a62ce(0x301)]=function(){const _0x5474d9=_0x2a62ce;return VisuMZ[_0x5474d9(0x291)][_0x5474d9(0x22b)][_0x5474d9(0x39a)][_0x5474d9(0x134)]??0x14;},Game_Enemy[_0x2a62ce(0x151)][_0x2a62ce(0x1c0)]=function(){const _0x2df937=_0x2a62ce;let _0x4ae882=[this[_0x2df937(0x2bd)]()];return _0x4ae882['concat'](this['skills']());},Game_Enemy[_0x2a62ce(0x151)][_0x2a62ce(0x333)]=function(){const _0x2a1076=_0x2a62ce;Game_Battler['prototype'][_0x2a1076(0x333)]['call'](this);const _0x2ca1c1=VisuMZ[_0x2a1076(0x291)][_0x2a1076(0x22b)]['PassiveStates'][_0x2a1076(0x376)];this[_0x2a1076(0x124)][_0x2a1076(0xc9)]=this[_0x2a1076(0x124)][_0x2a1076(0xc9)][_0x2a1076(0x114)](_0x2ca1c1);},Game_Enemy[_0x2a62ce(0x151)][_0x2a62ce(0xef)]=function(){const _0x3b8eb7=_0x2a62ce,_0x502f44=[];for(const _0x37900d of this[_0x3b8eb7(0x2bd)]()[_0x3b8eb7(0x2e3)]){const _0x2fb2b3=$dataSkills[_0x37900d[_0x3b8eb7(0x2fd)]];if(_0x2fb2b3&&!_0x502f44[_0x3b8eb7(0x336)](_0x2fb2b3))_0x502f44['push'](_0x2fb2b3);}return _0x502f44;},Game_Enemy[_0x2a62ce(0x151)][_0x2a62ce(0x3ac)]=function(_0x1eae88){const _0x3f29b5=_0x2a62ce;return this[_0x3f29b5(0x37d)]($dataStates[_0x1eae88]);},VisuMZ['SkillsStatesCore']['Game_Unit_isAllDead']=Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0xb6)],Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0xb6)]=function(){const _0x426136=_0x2a62ce;if(this[_0x426136(0x13a)]())return!![];return VisuMZ[_0x426136(0x291)][_0x426136(0xe1)][_0x426136(0x107)](this);},Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0x13a)]=function(){const _0x501aec=_0x2a62ce,_0x525841=this[_0x501aec(0x2e1)]();for(const _0x322e86 of _0x525841){if(!_0x322e86[_0x501aec(0x3a4)]())return![];}return!![];},Game_Unit[_0x2a62ce(0x151)][_0x2a62ce(0x358)]=function(){const _0x62d3f9=_0x2a62ce;for(const _0x3ce335 of this[_0x62d3f9(0x32a)]()){if(!_0x3ce335)continue;_0x3ce335['refresh']();}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x276)]=Game_Player[_0x2a62ce(0x151)][_0x2a62ce(0x287)],Game_Player[_0x2a62ce(0x151)][_0x2a62ce(0x287)]=function(){const _0x4625cc=_0x2a62ce;VisuMZ[_0x4625cc(0x291)][_0x4625cc(0x276)][_0x4625cc(0x107)](this),$gameParty['refreshAllMembers'](),$gameParty[_0x4625cc(0x322)]()&&$gameTroop[_0x4625cc(0x358)]();},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x3c0)]=Game_Troop['prototype'][_0x2a62ce(0x177)],Game_Troop['prototype'][_0x2a62ce(0x177)]=function(_0x401a89){const _0x1c1f83=_0x2a62ce;VisuMZ['SkillsStatesCore'][_0x1c1f83(0x3c0)][_0x1c1f83(0x107)](this,_0x401a89),this[_0x1c1f83(0xe6)]();},Game_Troop[_0x2a62ce(0x151)][_0x2a62ce(0xe6)]=function(){const _0x3a8222=_0x2a62ce;this[_0x3a8222(0xb3)]=Graphics[_0x3a8222(0x218)];},Game_Troop[_0x2a62ce(0x151)][_0x2a62ce(0x28f)]=function(){const _0x5998eb=_0x2a62ce;return this[_0x5998eb(0xb3)]=this[_0x5998eb(0xb3)]||Graphics['frameCount'],this[_0x5998eb(0xb3)];},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x204)]=function(){const _0x2eef17=_0x2a62ce;if(ConfigManager[_0x2eef17(0x2fb)]&&ConfigManager[_0x2eef17(0x3b4)]!==undefined)return ConfigManager[_0x2eef17(0x3b4)];else{if(this[_0x2eef17(0x193)]())return this[_0x2eef17(0x354)]()[_0x2eef17(0x330)](/LOWER/i);else Scene_ItemBase[_0x2eef17(0x151)][_0x2eef17(0x288)]['call'](this);}},Scene_Skill['prototype'][_0x2a62ce(0x288)]=function(){const _0x21e81d=_0x2a62ce;if(ConfigManager['uiMenuStyle']&&ConfigManager['uiInputPosition']!==undefined)return ConfigManager[_0x21e81d(0x127)];else return this['isUseSkillsStatesCoreUpdatedLayout']()?this[_0x21e81d(0x354)]()[_0x21e81d(0x330)](/RIGHT/i):Scene_ItemBase['prototype']['isRightInputMode'][_0x21e81d(0x107)](this);},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x354)]=function(){const _0x4e14df=_0x2a62ce;return VisuMZ[_0x4e14df(0x291)][_0x4e14df(0x22b)][_0x4e14df(0x314)][_0x4e14df(0x3a1)];},Scene_Skill['prototype'][_0x2a62ce(0x38e)]=function(){const _0x3121fc=_0x2a62ce;return this[_0x3121fc(0x2b4)]&&this['_categoryWindow'][_0x3121fc(0x38e)]();},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x193)]=function(){const _0x3f0e19=_0x2a62ce;return VisuMZ[_0x3f0e19(0x291)][_0x3f0e19(0x22b)]['Skills'][_0x3f0e19(0x3a0)];},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x341)]=Scene_Skill['prototype'][_0x2a62ce(0x21c)],Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x21c)]=function(){const _0x40f56e=_0x2a62ce;return this[_0x40f56e(0x193)]()?this[_0x40f56e(0x264)]():VisuMZ[_0x40f56e(0x291)][_0x40f56e(0x341)][_0x40f56e(0x107)](this);},Scene_Skill['prototype'][_0x2a62ce(0x264)]=function(){const _0x1f2779=_0x2a62ce,_0x2975fc=0x0,_0x1a9b90=this[_0x1f2779(0x1b9)](),_0x14b6bd=Graphics[_0x1f2779(0xc2)],_0x287fe6=this['helpAreaHeight']();return new Rectangle(_0x2975fc,_0x1a9b90,_0x14b6bd,_0x287fe6);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x162)]=Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x146)],Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x146)]=function(){const _0x2b4bc7=_0x2a62ce;return this[_0x2b4bc7(0x193)]()?this['skillTypeWindowRectSkillsStatesCore']():VisuMZ['SkillsStatesCore'][_0x2b4bc7(0x162)]['call'](this);},Scene_Skill['prototype'][_0x2a62ce(0x139)]=function(){const _0x1f41ea=_0x2a62ce;return VisuMZ[_0x1f41ea(0x291)][_0x1f41ea(0x22b)][_0x1f41ea(0x314)]['CmdWidth']??Scene_MenuBase[_0x1f41ea(0x151)][_0x1f41ea(0x139)][_0x1f41ea(0x107)](this);},Scene_Skill[_0x2a62ce(0x151)]['skillTypeWindowRectSkillsStatesCore']=function(){const _0x53ea55=_0x2a62ce,_0x3e8a0b=this[_0x53ea55(0x139)](),_0x1c4aa1=this[_0x53ea55(0x1e6)](0x3,!![]),_0x290a29=this[_0x53ea55(0x288)]()?Graphics['boxWidth']-_0x3e8a0b:0x0,_0x170bcf=this['mainAreaTop']();return new Rectangle(_0x290a29,_0x170bcf,_0x3e8a0b,_0x1c4aa1);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x315)]=Scene_Skill[_0x2a62ce(0x151)]['statusWindowRect'],Scene_Skill['prototype'][_0x2a62ce(0x340)]=function(){const _0x3cbddb=_0x2a62ce;return this[_0x3cbddb(0x193)]()?this['statusWindowRectSkillsStatesCore']():VisuMZ[_0x3cbddb(0x291)][_0x3cbddb(0x315)][_0x3cbddb(0x107)](this);},Scene_Skill['prototype'][_0x2a62ce(0x328)]=function(){const _0x58fb4f=_0x2a62ce,_0x8f0fb3=Graphics[_0x58fb4f(0xc2)]-this[_0x58fb4f(0x139)](),_0x18e2fd=this['_skillTypeWindow'][_0x58fb4f(0x3b8)],_0x4cd267=this['isRightInputMode']()?0x0:Graphics[_0x58fb4f(0xc2)]-_0x8f0fb3,_0x16d034=this[_0x58fb4f(0x14c)]();return new Rectangle(_0x4cd267,_0x16d034,_0x8f0fb3,_0x18e2fd);},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x37b)]=Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x344)],Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x344)]=function(){const _0x528c43=_0x2a62ce;VisuMZ['SkillsStatesCore'][_0x528c43(0x37b)]['call'](this),this[_0x528c43(0xf0)]()&&this[_0x528c43(0x383)]();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x35c)]=Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0xb8)],Scene_Skill['prototype']['itemWindowRect']=function(){const _0x2bb687=_0x2a62ce;if(this[_0x2bb687(0x193)]())return this[_0x2bb687(0x349)]();else{const _0x40d576=VisuMZ[_0x2bb687(0x291)]['Scene_Skill_itemWindowRect'][_0x2bb687(0x107)](this);return this[_0x2bb687(0xf0)]()&&this['adjustItemWidthByShopStatus']()&&(_0x40d576['width']-=this['shopStatusWidth']()),_0x40d576;}},Scene_Skill['prototype'][_0x2a62ce(0x349)]=function(){const _0x3225f4=_0x2a62ce,_0x59ad2d=Graphics['boxWidth']-this[_0x3225f4(0x327)](),_0x51b6cf=this[_0x3225f4(0x21a)]()-this[_0x3225f4(0x3a8)]['height'],_0x44a975=this[_0x3225f4(0x288)]()?Graphics['boxWidth']-_0x59ad2d:0x0,_0x48eb8c=this[_0x3225f4(0x3a8)]['y']+this[_0x3225f4(0x3a8)][_0x3225f4(0x3b8)];return new Rectangle(_0x44a975,_0x48eb8c,_0x59ad2d,_0x51b6cf);},Scene_Skill['prototype'][_0x2a62ce(0xf0)]=function(){const _0x3947f2=_0x2a62ce;if(!Imported[_0x3947f2(0xbb)])return![];else return this[_0x3947f2(0x193)]()?!![]:VisuMZ['SkillsStatesCore']['Settings'][_0x3947f2(0x314)][_0x3947f2(0x2b7)];},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x2c5)]=function(){const _0x901bdb=_0x2a62ce;return VisuMZ[_0x901bdb(0x291)][_0x901bdb(0x22b)][_0x901bdb(0x314)][_0x901bdb(0x255)];},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x383)]=function(){const _0x1b1c33=_0x2a62ce,_0x6b03b3=this['shopStatusWindowRect']();this[_0x1b1c33(0x25a)]=new Window_ShopStatus(_0x6b03b3),this[_0x1b1c33(0x2f8)](this[_0x1b1c33(0x25a)]),this[_0x1b1c33(0x28a)][_0x1b1c33(0x3c9)](this[_0x1b1c33(0x25a)]);const _0x3a6c66=VisuMZ['SkillsStatesCore'][_0x1b1c33(0x22b)][_0x1b1c33(0x314)][_0x1b1c33(0x138)];this[_0x1b1c33(0x25a)]['setBackgroundType'](_0x3a6c66||0x0);},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x303)]=function(){const _0x19383c=_0x2a62ce;return this['isUseSkillsStatesCoreUpdatedLayout']()?this['shopStatusWindowRectSkillsStatesCore']():VisuMZ['SkillsStatesCore'][_0x19383c(0x22b)]['Skills'][_0x19383c(0x237)][_0x19383c(0x107)](this);},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0xb5)]=function(){const _0x35c7ae=_0x2a62ce,_0x1fa5b5=this[_0x35c7ae(0x327)](),_0x5ebd3a=this[_0x35c7ae(0x28a)][_0x35c7ae(0x3b8)],_0x22f921=this[_0x35c7ae(0x288)]()?0x0:Graphics[_0x35c7ae(0xc2)]-this['shopStatusWidth'](),_0x50dca4=this[_0x35c7ae(0x28a)]['y'];return new Rectangle(_0x22f921,_0x50dca4,_0x1fa5b5,_0x5ebd3a);},Scene_Skill['prototype'][_0x2a62ce(0x327)]=function(){const _0x1ac2a5=_0x2a62ce;return Imported['VisuMZ_1_ItemsEquipsCore']?Scene_Shop[_0x1ac2a5(0x151)][_0x1ac2a5(0x368)]():0x0;},Scene_Skill['prototype'][_0x2a62ce(0xff)]=function(){const _0x59e7ab=_0x2a62ce;return this[_0x59e7ab(0x11c)]&&this[_0x59e7ab(0x11c)][_0x59e7ab(0x39c)]?TextManager['buttonAssistSwitch']:'';},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x348)]=Scene_Skill[_0x2a62ce(0x151)]['onItemOk'],Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x311)]=function(){const _0x549d76=_0x2a62ce,_0x3366ce=this[_0x549d76(0xd6)]();DataManager[_0x549d76(0x35a)](_0x3366ce)?this[_0x549d76(0x12c)]():VisuMZ[_0x549d76(0x291)][_0x549d76(0x348)]['call'](this);},Scene_Skill[_0x2a62ce(0x151)][_0x2a62ce(0x12c)]=function(){const _0x1e3f80=_0x2a62ce;SoundManager['playEquip']();const _0x57fed3=this['item'](),_0xf1122f=this[_0x1e3f80(0x1a3)]()[_0x1e3f80(0x1a8)](_0x57fed3);if(!_0xf1122f)this['actor']()[_0x1e3f80(0x37c)](_0x57fed3);this[_0x1e3f80(0x1a3)]()[_0x1e3f80(0x2eb)](_0x57fed3,!_0xf1122f),this[_0x1e3f80(0x28a)][_0x1e3f80(0x287)](),this[_0x1e3f80(0x28a)]['activate']();if(this['_statusWindow'])this['_statusWindow'][_0x1e3f80(0x287)]();},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x21b)]=Scene_Battle[_0x2a62ce(0x151)][_0x2a62ce(0xb2)],Scene_Battle[_0x2a62ce(0x151)]['onSkillOk']=function(){const _0x10eee7=_0x2a62ce,_0xd1f073=this[_0x10eee7(0x36c)]['item']();DataManager['isToggleSkill'](_0xd1f073)?this[_0x10eee7(0x12c)]():VisuMZ[_0x10eee7(0x291)][_0x10eee7(0x21b)][_0x10eee7(0x107)](this);},Scene_Battle[_0x2a62ce(0x151)]['onSkillToggle']=function(){const _0x4feb77=_0x2a62ce;SoundManager['playEquip']();const _0x4c9d56=this[_0x4feb77(0x36c)]['item'](),_0x570cf2=BattleManager[_0x4feb77(0x1a3)](),_0x58ec50=_0x570cf2[_0x4feb77(0x1a8)](_0x4c9d56);if(!_0x58ec50)_0x570cf2[_0x4feb77(0x37c)](_0x4c9d56);_0x570cf2[_0x4feb77(0x2eb)](_0x4c9d56,!_0x58ec50);if(Imported[_0x4feb77(0x243)]){let _0x2977d1=0x0;_0x570cf2[_0x4feb77(0x1a8)](_0x4c9d56)?_0x4c9d56[_0x4feb77(0x12a)][_0x4feb77(0x330)](/<TOGGLE ON (?:ANI|ANIMATION):[ ](\d+)>/i)?_0x2977d1=Number(RegExp['$1']):_0x2977d1=_0x4c9d56['animationId']||0x0:_0x4c9d56['note']['match'](/<TOGGLE OFF (?:ANI|ANIMATION):[ ](\d+)>/i)?_0x2977d1=Number(RegExp['$1']):_0x2977d1=VisuMZ[_0x4feb77(0x291)][_0x4feb77(0x22b)][_0x4feb77(0x252)][_0x4feb77(0xfd)]??0x0,_0x2977d1>0x0&&$gameTemp[_0x4feb77(0x1b7)]([_0x570cf2],_0x2977d1,![],![]);}this[_0x4feb77(0x36c)][_0x4feb77(0x287)](),this[_0x4feb77(0x36c)][_0x4feb77(0x14b)]();if(this[_0x4feb77(0x3a8)])this['_statusWindow']['refresh']();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x24e)]=Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x2e2)],Sprite_Gauge[_0x2a62ce(0x151)]['initMembers']=function(){const _0xf5400=_0x2a62ce;VisuMZ[_0xf5400(0x291)]['Sprite_Gauge_initMembers'][_0xf5400(0x107)](this),this[_0xf5400(0x334)]=null;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x1d8)]=Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x177)],Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x177)]=function(_0xae677a,_0x57df87){const _0x3fb9e7=_0x2a62ce;this[_0x3fb9e7(0x1b3)](_0xae677a,_0x57df87),_0x57df87=_0x57df87[_0x3fb9e7(0x1fe)](),VisuMZ[_0x3fb9e7(0x291)][_0x3fb9e7(0x1d8)][_0x3fb9e7(0x107)](this,_0xae677a,_0x57df87);},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x1b3)]=function(_0x17bbed,_0x401d17){const _0x120060=_0x2a62ce,_0x2b94f6=VisuMZ['SkillsStatesCore'][_0x120060(0x22b)]['Costs'][_0x120060(0x240)](_0x44aaa9=>_0x44aaa9['Name'][_0x120060(0x2f9)]()===_0x401d17[_0x120060(0x2f9)]());_0x2b94f6[_0x120060(0x121)]>=0x1?this[_0x120060(0x334)]=_0x2b94f6[0x0]:this[_0x120060(0x334)]=null;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x17f)]=Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x373)],Sprite_Gauge['prototype'][_0x2a62ce(0x373)]=function(){const _0x1b9e2c=_0x2a62ce;return this['_battler']&&this[_0x1b9e2c(0x334)]?this[_0x1b9e2c(0xaf)]():VisuMZ['SkillsStatesCore'][_0x1b9e2c(0x17f)][_0x1b9e2c(0x107)](this);},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0xaf)]=function(){const _0x5814c2=_0x2a62ce;return this[_0x5814c2(0x334)][_0x5814c2(0x156)][_0x5814c2(0x107)](this['_battler']);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x39e)]=Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x10e)],Sprite_Gauge['prototype'][_0x2a62ce(0x10e)]=function(){const _0x224da6=_0x2a62ce;return this[_0x224da6(0x39b)]&&this[_0x224da6(0x334)]?this[_0x224da6(0x2d4)]():VisuMZ[_0x224da6(0x291)][_0x224da6(0x39e)][_0x224da6(0x107)](this);},Sprite_Gauge['prototype']['currentMaxValueSkillsStatesCore']=function(){const _0x593162=_0x2a62ce;return this[_0x593162(0x334)][_0x593162(0x30f)][_0x593162(0x107)](this['_battler']);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x188)]=Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x1d1)],Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x1d1)]=function(){const _0x49016a=_0x2a62ce,_0xd17bee=VisuMZ[_0x49016a(0x291)]['Sprite_Gauge_gaugeRate']['call'](this);return _0xd17bee['clamp'](0x0,0x1);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3bc)]=Sprite_Gauge['prototype'][_0x2a62ce(0xf7)],Sprite_Gauge[_0x2a62ce(0x151)]['redraw']=function(){const _0x43969a=_0x2a62ce;this[_0x43969a(0x39b)]&&this['_costSettings']?(this[_0x43969a(0x1d9)][_0x43969a(0x394)](),this['redrawSkillsStatesCore']()):VisuMZ['SkillsStatesCore'][_0x43969a(0x3bc)][_0x43969a(0x107)](this);},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x26a)]=function(){const _0x25f740=_0x2a62ce;let _0x5cce73=this['currentValue']();return Imported['VisuMZ_0_CoreEngine']&&this[_0x25f740(0x2ff)]()&&(_0x5cce73=VisuMZ['GroupDigits'](_0x5cce73)),_0x5cce73;},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x23a)]=function(){const _0x3d4f5a=_0x2a62ce;this[_0x3d4f5a(0x1d9)][_0x3d4f5a(0x394)](),this[_0x3d4f5a(0x334)][_0x3d4f5a(0x2ba)][_0x3d4f5a(0x107)](this);},Sprite_Gauge[_0x2a62ce(0x151)]['drawFullGauge']=function(_0x2b134c,_0x1fb6a5,_0x73369a,_0x32bc39,_0x33abe0,_0x1a7f8e){const _0x23237d=_0x2a62ce,_0x53aea5=this[_0x23237d(0x1d1)](),_0x1d5062=Math[_0x23237d(0x119)]((_0x33abe0-0x2)*_0x53aea5),_0x5bd45f=_0x1a7f8e-0x2,_0x39df03=this[_0x23237d(0x286)]();this['bitmap']['fillRect'](_0x73369a,_0x32bc39,_0x33abe0,_0x1a7f8e,_0x39df03),this[_0x23237d(0x1d9)][_0x23237d(0x207)](_0x73369a+0x1,_0x32bc39+0x1,_0x1d5062,_0x5bd45f,_0x2b134c,_0x1fb6a5);},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x2a5)]=function(){const _0x41e836=_0x2a62ce,_0x32b30b=VisuMZ[_0x41e836(0x291)][_0x41e836(0x22b)][_0x41e836(0x370)];return _0x32b30b['LabelFontMainType']===_0x41e836(0x148)?$gameSystem[_0x41e836(0x1ae)]():$gameSystem[_0x41e836(0x132)]();},Sprite_Gauge['prototype']['labelFontSize']=function(){const _0x64f8d9=_0x2a62ce,_0x3e540f=VisuMZ['SkillsStatesCore'][_0x64f8d9(0x22b)][_0x64f8d9(0x370)];return _0x3e540f[_0x64f8d9(0x254)]==='number'?$gameSystem[_0x64f8d9(0x1e2)]()-0x6:$gameSystem['mainFontSize']()-0x2;},Sprite_Gauge[_0x2a62ce(0x151)]['valueFontFace']=function(){const _0x5528f8=_0x2a62ce,_0x5cf27a=VisuMZ[_0x5528f8(0x291)]['Settings'][_0x5528f8(0x370)];return _0x5cf27a['ValueFontMainType']===_0x5528f8(0x148)?$gameSystem[_0x5528f8(0x1ae)]():$gameSystem['mainFontFace']();},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x18c)]=function(){const _0xbe1d65=_0x2a62ce,_0x4722ef=VisuMZ['SkillsStatesCore'][_0xbe1d65(0x22b)][_0xbe1d65(0x370)];return _0x4722ef[_0xbe1d65(0x38b)]===_0xbe1d65(0x148)?$gameSystem[_0xbe1d65(0x1e2)]()-0x6:$gameSystem[_0xbe1d65(0x1e2)]()-0x2;},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x3c7)]=function(){const _0x5694a2=_0x2a62ce,_0x4873e0=VisuMZ['SkillsStatesCore'][_0x5694a2(0x22b)][_0x5694a2(0x370)];if(_0x4873e0['MatchLabelColor']){if(_0x4873e0[_0x5694a2(0x219)]===0x1)return this[_0x5694a2(0x25c)]();else{if(_0x4873e0['MatchLabelGaugeColor']===0x2)return this[_0x5694a2(0x13f)]();}}const _0x588c50=_0x4873e0[_0x5694a2(0x239)];return ColorManager[_0x5694a2(0x1cf)](_0x588c50);},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x350)]=function(){const _0x177ad0=_0x2a62ce,_0x1ddce6=VisuMZ['SkillsStatesCore'][_0x177ad0(0x22b)][_0x177ad0(0x370)];if(this[_0x177ad0(0x1de)]()<=0x0)return _0x177ad0(0x3b1);else return _0x1ddce6[_0x177ad0(0x161)]?_0x177ad0(0x110):ColorManager['outlineColor']();},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x1de)]=function(){const _0x2d428a=_0x2a62ce;return VisuMZ[_0x2d428a(0x291)][_0x2d428a(0x22b)][_0x2d428a(0x370)][_0x2d428a(0x2b1)]||0x0;},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x11a)]=function(){const _0x2f26be=_0x2a62ce,_0x21f7bc=VisuMZ['SkillsStatesCore'][_0x2f26be(0x22b)][_0x2f26be(0x370)];if(this[_0x2f26be(0x200)]()<=0x0)return _0x2f26be(0x3b1);else return _0x21f7bc[_0x2f26be(0x152)]?'rgba(0,\x200,\x200,\x201)':ColorManager[_0x2f26be(0x34d)]();},Sprite_Gauge[_0x2a62ce(0x151)][_0x2a62ce(0x200)]=function(){const _0x41cdfd=_0x2a62ce;return VisuMZ[_0x41cdfd(0x291)][_0x41cdfd(0x22b)][_0x41cdfd(0x370)][_0x41cdfd(0x1d5)]||0x0;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x129)]=Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x1c8)],Sprite_StateIcon['prototype'][_0x2a62ce(0x1c8)]=function(){const _0x5cb428=_0x2a62ce;VisuMZ[_0x5cb428(0x291)][_0x5cb428(0x129)]['call'](this),this[_0x5cb428(0xb1)]();},Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0xb1)]=function(){const _0x49023f=_0x2a62ce,_0x2fa594=Window_Base[_0x49023f(0x151)][_0x49023f(0x2df)]();this[_0x49023f(0x2f6)]=new Sprite(),this[_0x49023f(0x2f6)][_0x49023f(0x1d9)]=new Bitmap(ImageManager[_0x49023f(0x32c)],_0x2fa594),this['_turnDisplaySprite'][_0x49023f(0x3a7)]['x']=this[_0x49023f(0x3a7)]['x'],this[_0x49023f(0x2f6)][_0x49023f(0x3a7)]['y']=this[_0x49023f(0x3a7)]['y'],this[_0x49023f(0x2af)](this[_0x49023f(0x2f6)]),this[_0x49023f(0x113)]=this['_turnDisplaySprite'][_0x49023f(0x1d9)];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x140)]=Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x26b)],Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x26b)]=function(){const _0xf648d0=_0x2a62ce;VisuMZ[_0xf648d0(0x291)][_0xf648d0(0x140)][_0xf648d0(0x107)](this),this[_0xf648d0(0xbe)]();},Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x27d)]=function(_0x227d6a,_0x13affb,_0x4eaea4,_0x34b052,_0x54a501){const _0x576223=_0x2a62ce;this[_0x576223(0x113)]['drawText'](_0x227d6a,_0x13affb,_0x4eaea4,_0x34b052,this[_0x576223(0x113)][_0x576223(0x3b8)],_0x54a501);},Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0xbe)]=function(){const _0x263ea3=_0x2a62ce;this[_0x263ea3(0x10d)](),this['contents'][_0x263ea3(0x394)]();const _0x3f82b8=this[_0x263ea3(0x39b)];if(!_0x3f82b8)return;const _0x2b2f7f=_0x3f82b8['states']()['filter'](_0x148152=>_0x148152[_0x263ea3(0x1c4)]>0x0),_0x316595=[...Array(0x8)[_0x263ea3(0x375)]()][_0x263ea3(0x240)](_0x494afa=>_0x3f82b8[_0x263ea3(0x33a)](_0x494afa)!==0x0),_0xff3344=this[_0x263ea3(0x38f)],_0x3c46cb=_0x2b2f7f[_0xff3344];if(_0x3c46cb)Window_Base[_0x263ea3(0x151)]['drawActorStateTurns']['call'](this,_0x3f82b8,_0x3c46cb,0x0,0x0),Window_Base['prototype']['drawActorStateData']['call'](this,_0x3f82b8,_0x3c46cb,0x0,0x0);else{const _0x48d4ec=_0x316595[_0xff3344-_0x2b2f7f[_0x263ea3(0x121)]];if(_0x48d4ec===undefined)return;Window_Base[_0x263ea3(0x151)][_0x263ea3(0x246)][_0x263ea3(0x107)](this,_0x3f82b8,_0x48d4ec,0x0,0x0),Window_Base['prototype'][_0x263ea3(0x39d)][_0x263ea3(0x107)](this,_0x3f82b8,_0x48d4ec,0x0,0x0);}},Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x10d)]=function(){const _0x298adf=_0x2a62ce;this['contents'][_0x298adf(0x386)]=$gameSystem['mainFontFace'](),this[_0x298adf(0x113)][_0x298adf(0xf9)]=$gameSystem[_0x298adf(0x1e2)](),this[_0x298adf(0x2c9)]();},Sprite_StateIcon[_0x2a62ce(0x151)]['resetTextColor']=function(){const _0x11edce=_0x2a62ce;this[_0x11edce(0x198)](ColorManager['normalColor']()),this[_0x11edce(0x395)](ColorManager[_0x11edce(0x34d)]());},Sprite_StateIcon['prototype'][_0x2a62ce(0x198)]=function(_0x29dfb7){const _0x26e83e=_0x2a62ce;this['contents'][_0x26e83e(0x343)]=_0x29dfb7;},Sprite_StateIcon[_0x2a62ce(0x151)][_0x2a62ce(0x395)]=function(_0x318d7d){const _0x567d22=_0x2a62ce;this['contents'][_0x567d22(0x34d)]=_0x318d7d;},Sprite_StateIcon['prototype'][_0x2a62ce(0x15a)]=function(){const _0x13bb0e=_0x2a62ce;this[_0x13bb0e(0x273)]=!![],this[_0x13bb0e(0x1c2)]();},Window_Base['prototype'][_0x2a62ce(0x2d0)]=function(_0x51b322,_0x3fea60,_0x4356c3,_0x57ef74,_0x5800b0){const _0x4c1d3c=_0x2a62ce,_0x1737a0=this[_0x4c1d3c(0x30a)](_0x51b322,_0x3fea60),_0x1b0b02=this['textSizeEx'](_0x1737a0,_0x4356c3,_0x57ef74,_0x5800b0),_0x4e8583=_0x4356c3+_0x5800b0-_0x1b0b02[_0x4c1d3c(0xf4)];this['drawTextEx'](_0x1737a0,_0x4e8583,_0x57ef74,_0x5800b0),this[_0x4c1d3c(0x10d)]();},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x30a)]=function(_0x1a4166,_0x52113e){const _0x482ae5=_0x2a62ce;let _0x7d6307='';for(settings of VisuMZ[_0x482ae5(0x291)][_0x482ae5(0x22b)]['Costs']){if(!this[_0x482ae5(0x20b)](_0x1a4166,_0x52113e,settings))continue;if(_0x7d6307[_0x482ae5(0x121)]>0x0)_0x7d6307+=this[_0x482ae5(0x27f)]();_0x7d6307+=this['createSkillCostText'](_0x1a4166,_0x52113e,settings);}_0x7d6307=this[_0x482ae5(0x36e)](_0x1a4166,_0x52113e,_0x7d6307);if(_0x52113e[_0x482ae5(0x12a)][_0x482ae5(0x330)](/<CUSTOM COST TEXT>\s*([\s\S]*)\s*<\/CUSTOM COST TEXT>/i)){if(_0x7d6307[_0x482ae5(0x121)]>0x0)_0x7d6307+=this[_0x482ae5(0x27f)]();_0x7d6307+=String(RegExp['$1']);}return _0x7d6307;},Window_Base['prototype'][_0x2a62ce(0x36e)]=function(_0x4d3d6e,_0x2703a2,_0x2aca48){return _0x2aca48;},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x20b)]=function(_0x31460e,_0x3b7081,_0x1a83ec){const _0x42a534=_0x2a62ce;let _0x18da49=_0x1a83ec[_0x42a534(0x217)]['call'](_0x31460e,_0x3b7081);return _0x18da49=_0x31460e['adjustSkillCost'](_0x3b7081,_0x18da49,_0x1a83ec),_0x1a83ec[_0x42a534(0x3b2)][_0x42a534(0x107)](_0x31460e,_0x3b7081,_0x18da49,_0x1a83ec);},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x145)]=function(_0x512e96,_0x4bb967,_0x262cb3){const _0x57f06e=_0x2a62ce;let _0xcf982f=_0x262cb3[_0x57f06e(0x217)]['call'](_0x512e96,_0x4bb967);return _0xcf982f=_0x512e96[_0x57f06e(0x180)](_0x4bb967,_0xcf982f,_0x262cb3),_0x262cb3[_0x57f06e(0x1ca)][_0x57f06e(0x107)](_0x512e96,_0x4bb967,_0xcf982f,_0x262cb3);},Window_Base['prototype'][_0x2a62ce(0x27f)]=function(){return'\x20';},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x1e0)]=function(_0x18ebf9,_0x357edb,_0x5cf740,_0x3280fc){const _0x287790=_0x2a62ce;if(!_0x18ebf9)return;VisuMZ['SkillsStatesCore'][_0x287790(0xde)][_0x287790(0x107)](this,_0x18ebf9,_0x357edb,_0x5cf740,_0x3280fc),this[_0x287790(0x371)](_0x18ebf9,_0x357edb,_0x5cf740,_0x3280fc);},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x371)]=function(_0x48f5ab,_0x42a5d4,_0x4d16d8,_0x511bcc){const _0x18c900=_0x2a62ce;_0x511bcc=_0x511bcc||0x90;const _0x1dcb91=ImageManager['standardIconWidth']||0x20,_0xcfa75e=ImageManager[_0x18c900(0x1ab)]||0x20,_0x22ce5a=_0x1dcb91,_0x3fdbdf=_0x48f5ab['allIcons']()[_0x18c900(0x272)](0x0,Math['floor'](_0x511bcc/_0x22ce5a)),_0x25c6be=_0x48f5ab[_0x18c900(0x1a4)]()[_0x18c900(0x240)](_0x2a9efb=>_0x2a9efb[_0x18c900(0x1c4)]>0x0),_0x56a865=[...Array(0x8)['keys']()]['filter'](_0x3bba74=>_0x48f5ab[_0x18c900(0x33a)](_0x3bba74)!==0x0),_0x41c30d=[];let _0x178796=_0x42a5d4;for(let _0xb83c6e=0x0;_0xb83c6e<_0x3fdbdf[_0x18c900(0x121)];_0xb83c6e++){this[_0x18c900(0x10d)]();const _0x582eb6=_0x25c6be[_0xb83c6e];if(_0x582eb6)!_0x41c30d['includes'](_0x582eb6)&&this[_0x18c900(0x1c1)](_0x48f5ab,_0x582eb6,_0x178796,_0x4d16d8),this['drawActorStateData'](_0x48f5ab,_0x582eb6,_0x178796,_0x4d16d8),_0x41c30d[_0x18c900(0x27e)](_0x582eb6);else{const _0x12b0cd=_0x56a865[_0xb83c6e-_0x25c6be[_0x18c900(0x121)]];this[_0x18c900(0x246)](_0x48f5ab,_0x12b0cd,_0x178796,_0x4d16d8),this[_0x18c900(0x39d)](_0x48f5ab,_0x12b0cd,_0x178796,_0x4d16d8);}_0x178796+=_0x22ce5a;}},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x1c1)]=function(_0x574206,_0x1a8a80,_0x1cdd25,_0x2d1799){const _0x593068=_0x2a62ce;if(!VisuMZ['SkillsStatesCore']['Settings'][_0x593068(0x39a)][_0x593068(0x1f3)])return;if(!_0x574206[_0x593068(0x210)](_0x1a8a80['id']))return;if(_0x1a8a80[_0x593068(0x223)]===0x0)return;if(_0x1a8a80[_0x593068(0x12a)][_0x593068(0x330)](/<HIDE STATE TURNS>/i))return;const _0x41c887=ImageManager[_0x593068(0x2a0)]||0x20,_0x275402=_0x41c887,_0x5225c6=_0x574206[_0x593068(0x299)](_0x1a8a80['id']),_0x2fe951=ColorManager[_0x593068(0x3a6)](_0x1a8a80);this[_0x593068(0x198)](_0x2fe951),this[_0x593068(0x395)](_0x593068(0x110)),this['contents'][_0x593068(0x2a4)]=!![],this[_0x593068(0x113)]['fontSize']=VisuMZ[_0x593068(0x291)][_0x593068(0x22b)][_0x593068(0x39a)][_0x593068(0x214)],_0x1cdd25+=VisuMZ[_0x593068(0x291)][_0x593068(0x22b)][_0x593068(0x39a)][_0x593068(0x3c2)],_0x2d1799+=VisuMZ[_0x593068(0x291)][_0x593068(0x22b)][_0x593068(0x39a)]['TurnOffsetY'],this[_0x593068(0x27d)](_0x5225c6,_0x1cdd25,_0x2d1799,_0x275402,_0x593068(0xdf)),this[_0x593068(0x113)][_0x593068(0x2a4)]=![],this[_0x593068(0x10d)]();},Window_Base['prototype']['drawActorStateData']=function(_0x476d74,_0x462269,_0x650913,_0x46c829){const _0x1a9166=_0x2a62ce;if(!VisuMZ[_0x1a9166(0x291)]['Settings']['States'][_0x1a9166(0x2da)])return;const _0x320fd5=ImageManager['standardIconWidth']||0x20,_0x5572f9=ImageManager[_0x1a9166(0x1ab)]||0x20,_0x24e7d7=_0x320fd5,_0x213166=_0x5572f9/0x2,_0x399383=ColorManager[_0x1a9166(0x2bc)]();this[_0x1a9166(0x198)](_0x399383),this[_0x1a9166(0x395)](_0x1a9166(0x110)),this['contents'][_0x1a9166(0x2a4)]=!![],this['contents'][_0x1a9166(0xf9)]=VisuMZ[_0x1a9166(0x291)][_0x1a9166(0x22b)]['States'][_0x1a9166(0x3cd)],_0x650913+=VisuMZ[_0x1a9166(0x291)][_0x1a9166(0x22b)]['States']['DataOffsetX'],_0x46c829+=VisuMZ['SkillsStatesCore'][_0x1a9166(0x22b)][_0x1a9166(0x39a)]['DataOffsetY'];const _0xd90e3=String(_0x476d74['getStateDisplay'](_0x462269['id']));this[_0x1a9166(0x27d)](_0xd90e3,_0x650913,_0x46c829,_0x24e7d7,'center'),this[_0x1a9166(0x113)][_0x1a9166(0x2a4)]=![],this['resetFontSettings']();},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x246)]=function(_0x25d245,_0x45c696,_0x31fa48,_0x485a3e){const _0x43add2=_0x2a62ce;if(!VisuMZ[_0x43add2(0x291)][_0x43add2(0x22b)][_0x43add2(0x14f)]['ShowTurns'])return;const _0x5c6dbb=_0x25d245[_0x43add2(0x33a)](_0x45c696);if(_0x5c6dbb===0x0)return;const _0x148920=_0x25d245['buffTurns'](_0x45c696),_0x45b385=ImageManager[_0x43add2(0x32c)],_0x5984c8=_0x5c6dbb>0x0?ColorManager[_0x43add2(0x230)]():ColorManager['debuffColor']();this[_0x43add2(0x198)](_0x5984c8),this[_0x43add2(0x395)](_0x43add2(0x110)),this['contents'][_0x43add2(0x2a4)]=!![],this['contents'][_0x43add2(0xf9)]=VisuMZ[_0x43add2(0x291)][_0x43add2(0x22b)]['Buffs'][_0x43add2(0x214)],_0x31fa48+=VisuMZ[_0x43add2(0x291)][_0x43add2(0x22b)][_0x43add2(0x14f)][_0x43add2(0x3c2)],_0x485a3e+=VisuMZ[_0x43add2(0x291)][_0x43add2(0x22b)][_0x43add2(0x14f)][_0x43add2(0x1e8)],this[_0x43add2(0x27d)](_0x148920,_0x31fa48,_0x485a3e,_0x45b385,_0x43add2(0xdf)),this[_0x43add2(0x113)][_0x43add2(0x2a4)]=![],this[_0x43add2(0x10d)]();},Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x39d)]=function(_0x37efd9,_0x421e91,_0x274761,_0x1f3521){const _0xd6fc1d=_0x2a62ce;if(!VisuMZ[_0xd6fc1d(0x291)][_0xd6fc1d(0x22b)]['Buffs'][_0xd6fc1d(0x2da)])return;const _0x3076d2=_0x37efd9['paramBuffRate'](_0x421e91),_0x122c11=_0x37efd9['buff'](_0x421e91),_0x2b27f9=ImageManager[_0xd6fc1d(0x2a0)]||0x20,_0x38b7c0=ImageManager[_0xd6fc1d(0x1ab)]||0x20,_0x5b0e90=_0x2b27f9,_0x20ee93=_0x38b7c0/0x2,_0x18a152=_0x122c11>0x0?ColorManager[_0xd6fc1d(0x230)]():ColorManager[_0xd6fc1d(0x33f)]();this[_0xd6fc1d(0x198)](_0x18a152),this[_0xd6fc1d(0x395)]('rgba(0,\x200,\x200,\x201)'),this[_0xd6fc1d(0x113)]['fontBold']=!![],this[_0xd6fc1d(0x113)][_0xd6fc1d(0xf9)]=VisuMZ[_0xd6fc1d(0x291)]['Settings']['Buffs'][_0xd6fc1d(0x3cd)],_0x274761+=VisuMZ[_0xd6fc1d(0x291)][_0xd6fc1d(0x22b)][_0xd6fc1d(0x14f)]['DataOffsetX'],_0x1f3521+=VisuMZ['SkillsStatesCore'][_0xd6fc1d(0x22b)][_0xd6fc1d(0x14f)]['DataOffsetY'];const _0x10cd8a=_0xd6fc1d(0x1c9)['format'](Math['round'](_0x3076d2*0x64));this[_0xd6fc1d(0x27d)](_0x10cd8a,_0x274761,_0x1f3521,_0x5b0e90,'center'),this['contents'][_0xd6fc1d(0x2a4)]=![],this[_0xd6fc1d(0x10d)]();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xfc)]=Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x198)],Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x198)]=function(_0x1cc69d){const _0xc84cf1=_0x2a62ce;this['_toggleSkillColor']&&(_0x1cc69d=ColorManager[_0xc84cf1(0x1cf)](VisuMZ[_0xc84cf1(0x291)][_0xc84cf1(0x22b)][_0xc84cf1(0x252)][_0xc84cf1(0x2ae)]??0x0)),VisuMZ[_0xc84cf1(0x291)][_0xc84cf1(0xfc)][_0xc84cf1(0x107)](this,_0x1cc69d);},VisuMZ[_0x2a62ce(0x291)]['Window_Base_drawText']=Window_Base[_0x2a62ce(0x151)]['drawText'],Window_Base[_0x2a62ce(0x151)]['drawText']=function(_0x2da896,_0x5125ed,_0xcba45c,_0x25d32c,_0x3fd6dd){const _0x16fe5d=_0x2a62ce;VisuMZ[_0x16fe5d(0x291)]['Window_Base_drawText'][_0x16fe5d(0x107)](this,_0x2da896,_0x5125ed,_0xcba45c,_0x25d32c,_0x3fd6dd),this[_0x16fe5d(0x11d)]=undefined;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x25b)]=Window_Base[_0x2a62ce(0x151)]['createAllSkillCostText'],Window_Base[_0x2a62ce(0x151)][_0x2a62ce(0x30a)]=function(_0x34eb0d,_0x4cfbdf){const _0x4e0a5b=_0x2a62ce;let _0x200a02=VisuMZ['SkillsStatesCore']['Window_Base_createAllSkillCostText_Toggle']['call'](this,_0x34eb0d,_0x4cfbdf);;return DataManager[_0x4e0a5b(0x35a)](_0x4cfbdf)&&_0x34eb0d&&(_0x34eb0d[_0x4e0a5b(0x1a8)](_0x4cfbdf)?_0x200a02=TextManager[_0x4e0a5b(0x3cc)]??_0x4e0a5b(0x33d):(TextManager[_0x4e0a5b(0x391)]===_0x4e0a5b(0x142)?_0x200a02=(TextManager[_0x4e0a5b(0x271)]??'[OFF]')+this[_0x4e0a5b(0x27f)]()+_0x200a02:_0x200a02=_0x200a02+this['skillCostSeparator']()+(TextManager[_0x4e0a5b(0x271)]??_0x4e0a5b(0x29f)),_0x200a02=_0x200a02['trim']())),_0x200a02;},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0xae)]=Window_StatusBase['prototype'][_0x2a62ce(0xf3)],Window_StatusBase['prototype']['placeGauge']=function(_0xcbff39,_0x4248d2,_0x1c16cf,_0x58d850){const _0x36ea71=_0x2a62ce;if(_0xcbff39[_0x36ea71(0x143)]())_0x4248d2=this[_0x36ea71(0x166)](_0xcbff39,_0x4248d2);this[_0x36ea71(0x1d7)](_0xcbff39,_0x4248d2,_0x1c16cf,_0x58d850);},Window_StatusBase['prototype'][_0x2a62ce(0x1d7)]=function(_0x1e51b7,_0x3224cc,_0x2d8e5e,_0x5718e3){const _0xfdfa9c=_0x2a62ce;if([_0xfdfa9c(0x2ec),'untitled'][_0xfdfa9c(0x336)](_0x3224cc[_0xfdfa9c(0x1fe)]()))return;VisuMZ[_0xfdfa9c(0x291)][_0xfdfa9c(0xae)][_0xfdfa9c(0x107)](this,_0x1e51b7,_0x3224cc,_0x2d8e5e,_0x5718e3);},Window_StatusBase['prototype']['convertGaugeTypeSkillsStatesCore']=function(_0x50da57,_0x28f5ae){const _0x352f9a=_0x2a62ce,_0x143e0f=_0x50da57[_0x352f9a(0x285)]()['note'];if(_0x28f5ae==='hp'&&_0x143e0f[_0x352f9a(0x330)](/<REPLACE HP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x28f5ae==='mp'&&_0x143e0f['match'](/<REPLACE MP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else return _0x28f5ae==='tp'&&_0x143e0f[_0x352f9a(0x330)](/<REPLACE TP GAUGE:[ ](.*)>/i)?String(RegExp['$1']):_0x28f5ae;}},VisuMZ[_0x2a62ce(0x291)]['Window_StatusBase_drawActorIcons']=Window_StatusBase[_0x2a62ce(0x151)][_0x2a62ce(0x1e0)],Window_StatusBase['prototype'][_0x2a62ce(0x1e0)]=function(_0x45b706,_0x4f51c5,_0x4d78a2,_0x273519){const _0x3e7df8=_0x2a62ce;if(!_0x45b706)return;Window_Base[_0x3e7df8(0x151)][_0x3e7df8(0x1e0)]['call'](this,_0x45b706,_0x4f51c5,_0x4d78a2,_0x273519);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2d8)]=Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x369)],Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x369)]=function(_0x2f9df4){const _0x41461d=_0x2a62ce;VisuMZ[_0x41461d(0x291)][_0x41461d(0x2d8)][_0x41461d(0x107)](this,_0x2f9df4),this[_0x41461d(0x2fe)](_0x2f9df4);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x2fe)]=function(_0x2e4d3c){const _0x482b41=_0x2a62ce,_0xee1c3=new Rectangle(0x0,0x0,_0x2e4d3c['width'],_0x2e4d3c[_0x482b41(0x3b8)]);this[_0x482b41(0xca)]=new Window_Base(_0xee1c3),this[_0x482b41(0xca)]['opacity']=0x0,this['addChild'](this[_0x482b41(0xca)]),this['updateCommandNameWindow']();},Window_SkillType[_0x2a62ce(0x151)]['callUpdateHelp']=function(){const _0xb6e065=_0x2a62ce;Window_Command[_0xb6e065(0x151)][_0xb6e065(0x2ea)][_0xb6e065(0x107)](this);if(this['_commandNameWindow'])this[_0xb6e065(0x11b)]();},Window_SkillType['prototype']['updateCommandNameWindow']=function(){const _0x4f619e=_0x2a62ce,_0x2136ff=this[_0x4f619e(0xca)];_0x2136ff['contents'][_0x4f619e(0x394)]();const _0x12e81d=this[_0x4f619e(0x221)](this[_0x4f619e(0x377)]());if(_0x12e81d===_0x4f619e(0x19d)&&this[_0x4f619e(0x164)]()>0x0){const _0x2a8457=this[_0x4f619e(0x190)](this[_0x4f619e(0x377)]());let _0x5b3831=this[_0x4f619e(0x13d)](this[_0x4f619e(0x377)]());_0x5b3831=_0x5b3831[_0x4f619e(0x275)](/\\I\[(\d+)\]/gi,''),_0x2136ff[_0x4f619e(0x10d)](),this[_0x4f619e(0x34f)](_0x5b3831,_0x2a8457),this[_0x4f619e(0x3b5)](_0x5b3831,_0x2a8457),this['commandNameWindowCenter'](_0x5b3831,_0x2a8457);}},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x34f)]=function(_0x5c3e6a,_0x4a1642){},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x3b5)]=function(_0x1815f9,_0x30614d){const _0x3fb9ac=_0x2a62ce,_0x4e61a0=this['_commandNameWindow'];_0x4e61a0['drawText'](_0x1815f9,0x0,_0x30614d['y'],_0x4e61a0[_0x3fb9ac(0x399)],_0x3fb9ac(0x232));},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0xc6)]=function(_0x3e6211,_0x6434dd){const _0x3709e0=_0x2a62ce,_0x3ca145=this[_0x3709e0(0xca)],_0x32b7f7=$gameSystem[_0x3709e0(0x169)](),_0x37871e=_0x6434dd['x']+Math[_0x3709e0(0x119)](_0x6434dd[_0x3709e0(0xf4)]/0x2)+_0x32b7f7;_0x3ca145['x']=_0x3ca145[_0x3709e0(0xf4)]/-0x2+_0x37871e,_0x3ca145['y']=Math['floor'](_0x6434dd['height']/0x2);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x38e)]=function(){const _0x7b296c=_0x2a62ce;return Imported[_0x7b296c(0x243)]&&Window_Command[_0x7b296c(0x151)][_0x7b296c(0x38e)]['call'](this);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x168)]=function(){const _0x4681e7=_0x2a62ce;if(!this[_0x4681e7(0x31c)])return;const _0x1ea1df=this[_0x4681e7(0x31c)][_0x4681e7(0x2f4)]();for(const _0x2ce0a5 of _0x1ea1df){const _0xf1ac02=this[_0x4681e7(0xb7)](_0x2ce0a5);this[_0x4681e7(0x3c1)](_0xf1ac02,'skill',!![],_0x2ce0a5);}},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0xb7)]=function(_0x2ac724){const _0x3300cd=_0x2a62ce;let _0x185f73=$dataSystem['skillTypes'][_0x2ac724];if(_0x185f73[_0x3300cd(0x330)](/\\I\[(\d+)\]/i))return _0x185f73;if(this[_0x3300cd(0x122)]()==='text')return _0x185f73;const _0x1a99f5=VisuMZ[_0x3300cd(0x291)][_0x3300cd(0x22b)][_0x3300cd(0x314)],_0x57ce05=$dataSystem['magicSkills']['includes'](_0x2ac724),_0x348ec8=_0x57ce05?_0x1a99f5['IconStypeMagic']:_0x1a99f5['IconStypeNorm'];return'\x5cI[%1]%2'['format'](_0x348ec8,_0x185f73);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x171)]=function(){const _0x2397a5=_0x2a62ce;return VisuMZ[_0x2397a5(0x291)]['Settings']['Skills'][_0x2397a5(0x20c)];},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x23c)]=function(_0x28cd01){const _0xca7dd9=_0x2a62ce,_0x323b0c=this[_0xca7dd9(0x221)](_0x28cd01);if(_0x323b0c===_0xca7dd9(0x250))this['drawItemStyleIconText'](_0x28cd01);else _0x323b0c==='icon'?this['drawItemStyleIcon'](_0x28cd01):Window_Command['prototype'][_0xca7dd9(0x23c)][_0xca7dd9(0x107)](this,_0x28cd01);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x122)]=function(){const _0x2fcff2=_0x2a62ce;return VisuMZ[_0x2fcff2(0x291)]['Settings'][_0x2fcff2(0x314)][_0x2fcff2(0x116)];},Window_SkillType['prototype'][_0x2a62ce(0x221)]=function(_0x5655b0){const _0x4332df=_0x2a62ce;if(_0x5655b0<0x0)return _0x4332df(0x34b);const _0xaeacec=this[_0x4332df(0x122)]();if(_0xaeacec!==_0x4332df(0x1a7))return _0xaeacec;else{if(this[_0x4332df(0x164)]()>0x0){const _0x4c733e=this[_0x4332df(0x13d)](_0x5655b0);if(_0x4c733e[_0x4332df(0x330)](/\\I\[(\d+)\]/i)){const _0x1b22ef=this[_0x4332df(0x190)](_0x5655b0),_0x5b93e5=this['textSizeEx'](_0x4c733e)[_0x4332df(0xf4)];return _0x5b93e5<=_0x1b22ef['width']?_0x4332df(0x250):_0x4332df(0x19d);}}}return _0x4332df(0x34b);},Window_SkillType[_0x2a62ce(0x151)][_0x2a62ce(0x10a)]=function(_0x4a2b85){const _0x396d9=_0x2a62ce,_0x187552=this[_0x396d9(0x190)](_0x4a2b85),_0x35aa8c=this[_0x396d9(0x13d)](_0x4a2b85),_0x47d319=this[_0x396d9(0x211)](_0x35aa8c)[_0x396d9(0xf4)];this['changePaintOpacity'](this[_0x396d9(0x260)](_0x4a2b85));const _0x439c56=this[_0x396d9(0x171)]();if(_0x439c56===_0x396d9(0xdf))this[_0x396d9(0x2bf)](_0x35aa8c,_0x187552['x']+_0x187552[_0x396d9(0xf4)]-_0x47d319,_0x187552['y'],_0x47d319);else{if(_0x439c56===_0x396d9(0x232)){const _0x2a3caa=_0x187552['x']+Math[_0x396d9(0x119)]((_0x187552[_0x396d9(0xf4)]-_0x47d319)/0x2);this['drawTextEx'](_0x35aa8c,_0x2a3caa,_0x187552['y'],_0x47d319);}else this[_0x396d9(0x2bf)](_0x35aa8c,_0x187552['x'],_0x187552['y'],_0x47d319);}},Window_SkillType['prototype'][_0x2a62ce(0x1c7)]=function(_0x22f09a){const _0x55ab9a=_0x2a62ce;this[_0x55ab9a(0x13d)](_0x22f09a)[_0x55ab9a(0x330)](/\\I\[(\d+)\]/i);const _0x204fd3=Number(RegExp['$1'])||0x0,_0x473138=this[_0x55ab9a(0x190)](_0x22f09a),_0x512336=_0x473138['x']+Math['floor']((_0x473138['width']-ImageManager[_0x55ab9a(0x32c)])/0x2),_0x1c78d7=_0x473138['y']+(_0x473138[_0x55ab9a(0x3b8)]-ImageManager['iconHeight'])/0x2;this[_0x55ab9a(0x345)](_0x204fd3,_0x512336,_0x1c78d7);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x36a)]=Window_SkillStatus[_0x2a62ce(0x151)][_0x2a62ce(0x287)],Window_SkillStatus[_0x2a62ce(0x151)][_0x2a62ce(0x287)]=function(){const _0x1b26d5=_0x2a62ce;VisuMZ[_0x1b26d5(0x291)]['Window_SkillStatus_refresh']['call'](this);if(this[_0x1b26d5(0x31c)])this[_0x1b26d5(0x189)]();},Window_SkillStatus[_0x2a62ce(0x151)][_0x2a62ce(0x189)]=function(){const _0x3cac02=_0x2a62ce;if(!Imported[_0x3cac02(0x243)])return;if(!Imported[_0x3cac02(0xe3)])return;const _0x4832f4=this[_0x3cac02(0x108)]();let _0x593304=this[_0x3cac02(0x2ef)]()/0x2+0xb4+0xb4+0xb4,_0x3a16c7=this[_0x3cac02(0x399)]-_0x593304-0x2;if(_0x3a16c7>=0x12c){const _0x1d3a17=VisuMZ['CoreEngine']['Settings'][_0x3cac02(0x339)]['DisplayedParams'],_0x4c5ebf=Math[_0x3cac02(0x119)](_0x3a16c7/0x2)-0x18;let _0x58a118=_0x593304,_0x94e3f5=Math['floor']((this[_0x3cac02(0x2c7)]-Math[_0x3cac02(0x1fc)](_0x1d3a17[_0x3cac02(0x121)]/0x2)*_0x4832f4)/0x2),_0x22a1c9=0x0;for(const _0x5abdaa of _0x1d3a17){this[_0x3cac02(0x366)](_0x58a118,_0x94e3f5,_0x4c5ebf,_0x5abdaa),_0x22a1c9++,_0x22a1c9%0x2===0x0?(_0x58a118=_0x593304,_0x94e3f5+=_0x4832f4):_0x58a118+=_0x4c5ebf+0x18;}}this[_0x3cac02(0x10d)]();},Window_SkillStatus[_0x2a62ce(0x151)][_0x2a62ce(0x366)]=function(_0x3ccfbd,_0x2c06c0,_0x105acd,_0x27c4ee){const _0x1c264f=_0x2a62ce,_0x323825=this[_0x1c264f(0x108)]();this['resetFontSettings'](),this[_0x1c264f(0xcd)](_0x3ccfbd,_0x2c06c0,_0x105acd,_0x27c4ee,!![]),this[_0x1c264f(0x2c9)](),this['contents'][_0x1c264f(0xf9)]-=0x8;const _0x44d373=this[_0x1c264f(0x31c)][_0x1c264f(0x194)](_0x27c4ee,!![]);this[_0x1c264f(0x113)][_0x1c264f(0x27d)](_0x44d373,_0x3ccfbd,_0x2c06c0,_0x105acd,_0x323825,'right');},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x384)]=Window_SkillList[_0x2a62ce(0x151)]['includes'],Window_SkillList[_0x2a62ce(0x151)]['includes']=function(_0x3806b3){const _0x1d8324=_0x2a62ce;if(this[_0x1d8324(0x3c5)]<=0x0)return![];return this[_0x1d8324(0x27b)](_0x3806b3);},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x2e6)]=Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x123)],Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x123)]=function(){const _0x12aac0=_0x2a62ce;return SceneManager['_scene'][_0x12aac0(0x2ed)]===Scene_Battle?VisuMZ['SkillsStatesCore'][_0x12aac0(0x2e6)][_0x12aac0(0x107)](this):VisuMZ[_0x12aac0(0x291)][_0x12aac0(0x22b)]['Skills'][_0x12aac0(0x18f)];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x1e1)]=Window_SkillList['prototype'][_0x2a62ce(0x2d3)],Window_SkillList[_0x2a62ce(0x151)]['setActor']=function(_0x4e461){const _0x485acd=_0x2a62ce,_0x1ccc14=this['_actor']!==_0x4e461;VisuMZ[_0x485acd(0x291)][_0x485acd(0x1e1)]['call'](this,_0x4e461),_0x1ccc14&&(this[_0x485acd(0x3a8)]&&this['_statusWindow'][_0x485acd(0x2ed)]===Window_ShopStatus&&this[_0x485acd(0x3a8)][_0x485acd(0x213)](this['itemAt'](0x0)));},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x1ef)]=function(_0x18119d){const _0x212721=_0x2a62ce;if(this[_0x212721(0x3c5)]===_0x18119d)return;if(!_0x18119d)return;this['_stypeId']=_0x18119d,this[_0x212721(0x287)](),this[_0x212721(0x385)](0x0,0x0),this['_statusWindow']&&this[_0x212721(0x3a8)]['constructor']===Window_ShopStatus&&this[_0x212721(0x3a8)][_0x212721(0x213)](this[_0x212721(0x355)](0x0));},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x27b)]=function(_0x234db8){const _0x373a0f=_0x2a62ce;if(!_0x234db8)return VisuMZ[_0x373a0f(0x291)][_0x373a0f(0x384)][_0x373a0f(0x107)](this,_0x234db8);if(!this['checkSkillTypeMatch'](_0x234db8))return![];if(!this[_0x373a0f(0x25f)](_0x234db8))return![];if(!this['checkShowHideJS'](_0x234db8))return![];return!![];},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x1b6)]=function(_0x22df64){const _0x4ff21c=_0x2a62ce;return DataManager[_0x4ff21c(0x1d3)](_0x22df64)[_0x4ff21c(0x336)](this[_0x4ff21c(0x3c5)]);},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x25f)]=function(_0x5d6e02){const _0x1fb764=_0x2a62ce;if(!VisuMZ[_0x1fb764(0x291)][_0x1fb764(0x28c)](this[_0x1fb764(0x31c)],_0x5d6e02))return![];if(!VisuMZ[_0x1fb764(0x291)][_0x1fb764(0x25d)](this[_0x1fb764(0x31c)],_0x5d6e02))return![];if(!VisuMZ[_0x1fb764(0x291)][_0x1fb764(0xdd)](this[_0x1fb764(0x31c)],_0x5d6e02))return![];return!![];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x28c)]=function(_0x4d12b0,_0x2d840f){const _0x197bda=_0x2a62ce,_0x5e1448=_0x2d840f[_0x197bda(0x12a)];if(_0x5e1448[_0x197bda(0x330)](/<HIDE IN BATTLE>/i)&&$gameParty[_0x197bda(0x322)]())return![];else return _0x5e1448[_0x197bda(0x330)](/<HIDE OUTSIDE BATTLE>/i)&&!$gameParty[_0x197bda(0x322)]()?![]:!![];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x25d)]=function(_0x4d3e90,_0x5a64f4){const _0xb1083e=_0x2a62ce,_0x5b0616=_0x5a64f4[_0xb1083e(0x12a)];if(_0x5b0616[_0xb1083e(0x330)](/<SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x228cb8=JSON[_0xb1083e(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x1eea73 of _0x228cb8){if(!$gameSwitches[_0xb1083e(0x34a)](_0x1eea73))return![];}return!![];}if(_0x5b0616[_0xb1083e(0x330)](/<SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x139eb5=JSON[_0xb1083e(0x342)]('['+RegExp['$1'][_0xb1083e(0x330)](/\d+/g)+']');for(const _0x51f4de of _0x139eb5){if(!$gameSwitches['value'](_0x51f4de))return![];}return!![];}if(_0x5b0616[_0xb1083e(0x330)](/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x356e0b=JSON[_0xb1083e(0x342)]('['+RegExp['$1'][_0xb1083e(0x330)](/\d+/g)+']');for(const _0x4375fc of _0x356e0b){if($gameSwitches[_0xb1083e(0x34a)](_0x4375fc))return!![];}return![];}if(_0x5b0616[_0xb1083e(0x330)](/<HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x68315e=JSON['parse']('['+RegExp['$1'][_0xb1083e(0x330)](/\d+/g)+']');for(const _0x5eedac of _0x68315e){if(!$gameSwitches[_0xb1083e(0x34a)](_0x5eedac))return!![];}return![];}if(_0x5b0616['match'](/<HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x599919=JSON['parse']('['+RegExp['$1'][_0xb1083e(0x330)](/\d+/g)+']');for(const _0x38f413 of _0x599919){if(!$gameSwitches[_0xb1083e(0x34a)](_0x38f413))return!![];}return![];}if(_0x5b0616[_0xb1083e(0x330)](/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xd2d4a1=JSON[_0xb1083e(0x342)]('['+RegExp['$1'][_0xb1083e(0x330)](/\d+/g)+']');for(const _0x35bb95 of _0xd2d4a1){if($gameSwitches['value'](_0x35bb95))return![];}return!![];}return!![];},VisuMZ['SkillsStatesCore']['CheckVisibleSkillNotetags']=function(_0x2715c9,_0x2b169c){const _0x20b2aa=_0x2a62ce,_0x427b27=_0x2b169c['note'];if(_0x427b27['match'](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x376a4f=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x3c5d68 of _0x376a4f){if(!_0x2715c9[_0x20b2aa(0x16a)](_0x3c5d68))return![];}return!![];}else{if(_0x427b27['match'](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4f4ec6=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x153f48 of _0x4f4ec6){const _0xf7ccb9=DataManager[_0x20b2aa(0x186)](_0x153f48);if(!_0xf7ccb9)continue;if(!_0x2715c9[_0x20b2aa(0x16a)](_0xf7ccb9))return![];}return!![];}}if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4bdd74=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x2341d5 of _0x4bdd74){if(!_0x2715c9[_0x20b2aa(0x16a)](_0x2341d5))return![];}return!![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4f51c2=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x3747c0 of _0x4f51c2){const _0x502926=DataManager[_0x20b2aa(0x186)](_0x3747c0);if(!_0x502926)continue;if(!_0x2715c9[_0x20b2aa(0x16a)](_0x502926))return![];}return!![];}}if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x443cfb=JSON[_0x20b2aa(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x208aaa of _0x443cfb){if(_0x2715c9[_0x20b2aa(0x16a)](_0x208aaa))return!![];}return![];}else{if(_0x427b27['match'](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x9f8e9e=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x172287 of _0x9f8e9e){const _0x2d9266=DataManager[_0x20b2aa(0x186)](_0x172287);if(!_0x2d9266)continue;if(_0x2715c9[_0x20b2aa(0x16a)](_0x2d9266))return!![];}return![];}}if(_0x427b27['match'](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4b42bd=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x4d6cb7 of _0x4b42bd){if(!_0x2715c9['isLearnedSkill'](_0x4d6cb7))return!![];}return![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x5eca0d=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x535c66 of _0x5eca0d){const _0x3ddfe6=DataManager[_0x20b2aa(0x186)](_0x535c66);if(!_0x3ddfe6)continue;if(!_0x2715c9[_0x20b2aa(0x16a)](_0x3ddfe6))return!![];}return![];}}if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x307cb3=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x392690 of _0x307cb3){if(!_0x2715c9[_0x20b2aa(0x16a)](_0x392690))return!![];}return![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x20f289=RegExp['$1']['split'](',');for(const _0x2bf26d of _0x20f289){const _0x408e8d=DataManager['getSkillIdWithName'](_0x2bf26d);if(!_0x408e8d)continue;if(!_0x2715c9[_0x20b2aa(0x16a)](_0x408e8d))return!![];}return![];}}if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xafe664=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x16f9ca of _0xafe664){if(_0x2715c9[_0x20b2aa(0x16a)](_0x16f9ca))return![];}return!![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x2b0956=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x4fa8d4 of _0x2b0956){const _0x60df2e=DataManager['getSkillIdWithName'](_0x4fa8d4);if(!_0x60df2e)continue;if(_0x2715c9['isLearnedSkill'](_0x60df2e))return![];}return!![];}}if(_0x427b27['match'](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2a755c=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x525193 of _0x2a755c){if(!_0x2715c9[_0x20b2aa(0x367)](_0x525193))return![];}return!![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0xf96165=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x384e52 of _0xf96165){const _0x27a960=DataManager[_0x20b2aa(0x186)](_0x384e52);if(!_0x27a960)continue;if(!_0x2715c9[_0x20b2aa(0x367)](_0x27a960))return![];}return!![];}}if(_0x427b27['match'](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x369a49=JSON[_0x20b2aa(0x342)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x231664 of _0x369a49){if(!_0x2715c9['hasSkill'](_0x231664))return![];}return!![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x1f47ef=RegExp['$1']['split'](',');for(const _0x234df4 of _0x1f47ef){const _0x34af22=DataManager[_0x20b2aa(0x186)](_0x234df4);if(!_0x34af22)continue;if(!_0x2715c9[_0x20b2aa(0x367)](_0x34af22))return![];}return!![];}}if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x55e5a0=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x20f3dc of _0x55e5a0){if(_0x2715c9[_0x20b2aa(0x367)](_0x20f3dc))return!![];}return![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x5cf029=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x328d23 of _0x5cf029){const _0x2aa660=DataManager[_0x20b2aa(0x186)](_0x328d23);if(!_0x2aa660)continue;if(_0x2715c9[_0x20b2aa(0x367)](_0x2aa660))return!![];}return![];}}if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x498214=JSON['parse']('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x109458 of _0x498214){if(!_0x2715c9[_0x20b2aa(0x367)](_0x109458))return!![];}return![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x1cf0b0=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x899a1c of _0x1cf0b0){const _0x5d550d=DataManager[_0x20b2aa(0x186)](_0x899a1c);if(!_0x5d550d)continue;if(!_0x2715c9[_0x20b2aa(0x367)](_0x5d550d))return!![];}return![];}}if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xcfbb88=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x2ef744 of _0xcfbb88){if(!_0x2715c9[_0x20b2aa(0x367)](_0x2ef744))return!![];}return![];}else{if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x28c358=RegExp['$1'][_0x20b2aa(0x181)](',');for(const _0x1a7107 of _0x28c358){const _0x3a2b8b=DataManager[_0x20b2aa(0x186)](_0x1a7107);if(!_0x3a2b8b)continue;if(!_0x2715c9[_0x20b2aa(0x367)](_0x3a2b8b))return!![];}return![];}}if(_0x427b27[_0x20b2aa(0x330)](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x107c7d=JSON[_0x20b2aa(0x342)]('['+RegExp['$1'][_0x20b2aa(0x330)](/\d+/g)+']');for(const _0x359270 of _0x107c7d){if(_0x2715c9[_0x20b2aa(0x367)](_0x359270))return![];}return!![];}else{if(_0x427b27['match'](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x21a4c5=RegExp['$1']['split'](',');for(const _0x13a7ff of _0x21a4c5){const _0x452ab6=DataManager['getSkillIdWithName'](_0x13a7ff);if(!_0x452ab6)continue;if(_0x2715c9[_0x20b2aa(0x367)](_0x452ab6))return![];}return!![];}}return!![];},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x11f)]=function(_0x2d33f5){const _0x3e0c53=_0x2a62ce,_0x17ec1b=_0x2d33f5[_0x3e0c53(0x12a)],_0x27c593=VisuMZ[_0x3e0c53(0x291)]['skillVisibleJS'];return _0x27c593[_0x2d33f5['id']]?_0x27c593[_0x2d33f5['id']][_0x3e0c53(0x107)](this,_0x2d33f5):!![];},VisuMZ['SkillsStatesCore'][_0x2a62ce(0x101)]=Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0xc7)],Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0xc7)]=function(){const _0x4ea3bb=_0x2a62ce;VisuMZ[_0x4ea3bb(0x291)][_0x4ea3bb(0x101)][_0x4ea3bb(0x107)](this),this[_0x4ea3bb(0x208)]()&&this[_0x4ea3bb(0x170)](),this[_0x4ea3bb(0x1f7)]()&&this[_0x4ea3bb(0x32d)]();},Window_SkillList['prototype'][_0x2a62ce(0x208)]=function(){return!![];},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x170)]=function(){const _0x494bbf=_0x2a62ce,_0x27e9e9=VisuMZ[_0x494bbf(0x291)][_0x494bbf(0x22b)][_0x494bbf(0x314)][_0x494bbf(0x12f)]||[];return _0x27e9e9&&_0x27e9e9[_0x494bbf(0x336)](this[_0x494bbf(0x3c5)])?this[_0x494bbf(0x147)][_0x494bbf(0x389)]((_0x3fa3bb,_0x535af8)=>{const _0x3f3e38=_0x494bbf;if(!!_0x3fa3bb&&!!_0x535af8)return _0x3fa3bb[_0x3f3e38(0x1f2)][_0x3f3e38(0x3cb)](_0x535af8[_0x3f3e38(0x1f2)]);return 0x0;}):VisuMZ[_0x494bbf(0x291)][_0x494bbf(0x3ad)](this[_0x494bbf(0x147)]),this['_data'];},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x3ad)]=function(_0xb5d45d){const _0x5551f5=_0x2a62ce;return _0xb5d45d[_0x5551f5(0x389)]((_0x184042,_0x5907c9)=>{const _0x2e1bcc=_0x5551f5;if(!!_0x184042&&!!_0x5907c9){if(_0x184042[_0x2e1bcc(0x153)]===undefined)VisuMZ[_0x2e1bcc(0x291)][_0x2e1bcc(0x2d9)](_0x184042);if(_0x5907c9['sortPriority']===undefined)VisuMZ[_0x2e1bcc(0x291)]['Parse_Notetags_Skill_Sorting'](_0x5907c9);const _0x3655f9=_0x184042[_0x2e1bcc(0x153)],_0x1295d0=_0x5907c9[_0x2e1bcc(0x153)];if(_0x3655f9!==_0x1295d0)return _0x1295d0-_0x3655f9;return _0x184042['id']-_0x5907c9['id'];}return 0x0;}),_0xb5d45d;},VisuMZ[_0x2a62ce(0x291)]['SortByIDandPriorityUsingIDs']=function(_0x3d4ab8){const _0x2d6011=_0x2a62ce;return _0x3d4ab8[_0x2d6011(0x389)]((_0x36e241,_0x3d4387)=>{const _0x292e34=_0x2d6011,_0x109e4a=$dataSkills[_0x36e241],_0x5c64ed=$dataSkills[_0x3d4387];if(!!_0x109e4a&&!!_0x5c64ed){if(_0x109e4a[_0x292e34(0x153)]===undefined)VisuMZ['SkillsStatesCore'][_0x292e34(0x2d9)](_0x109e4a);if(_0x5c64ed[_0x292e34(0x153)]===undefined)VisuMZ[_0x292e34(0x291)]['Parse_Notetags_Skill_Sorting'](_0x5c64ed);const _0x4e36f=_0x109e4a['sortPriority'],_0x13dc34=_0x5c64ed[_0x292e34(0x153)];if(_0x4e36f!==_0x13dc34)return _0x13dc34-_0x4e36f;return _0x36e241-_0x3d4387;}return 0x0;}),_0x3d4ab8;},Window_SkillList['prototype'][_0x2a62ce(0x1f7)]=function(){const _0x418ce8=_0x2a62ce;if(!this[_0x418ce8(0x31c)])return![];if([_0x418ce8(0xd8),'equipBattleSkills',_0x418ce8(0x15e)][_0x418ce8(0x336)](this['_stypeId']))return![];return!![];},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x32d)]=function(){const _0x403cc2=_0x2a62ce,_0x21b621=this[_0x403cc2(0x31c)][_0x403cc2(0x1a4)]();for(const _0x4bb01c of _0x21b621){const _0xe99401=DataManager[_0x403cc2(0x244)](_0x4bb01c);for(const _0x301a85 in _0xe99401){const _0x4f9a11=$dataSkills[Number(_0x301a85)]||null,_0x4c1747=$dataSkills[Number(_0xe99401[_0x301a85])]||null;while(this[_0x403cc2(0x147)][_0x403cc2(0x336)](_0x4f9a11)){const _0x54b166=this[_0x403cc2(0x147)][_0x403cc2(0x297)](_0x4f9a11);this[_0x403cc2(0x147)][_0x54b166]=_0x4c1747;}}}},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x33c)]=Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x23c)],Window_SkillList['prototype'][_0x2a62ce(0x23c)]=function(_0x504dea){const _0x2a7e03=_0x2a62ce,_0x4ad492=this[_0x2a7e03(0x355)](_0x504dea),_0x2e97dc=_0x4ad492?_0x4ad492[_0x2a7e03(0x1f2)]:'';if(_0x4ad492)this[_0x2a7e03(0x267)](_0x4ad492);DataManager[_0x2a7e03(0x35a)](_0x4ad492)&&this['_actor']&&this[_0x2a7e03(0x31c)][_0x2a7e03(0x1a8)](_0x4ad492)&&(this[_0x2a7e03(0x11d)]=!![]);VisuMZ['SkillsStatesCore']['Window_SkillList_drawItem'][_0x2a7e03(0x107)](this,_0x504dea),this[_0x2a7e03(0x11d)]=undefined;if(_0x4ad492)_0x4ad492['name']=_0x2e97dc;},Window_SkillList['prototype']['alterSkillName']=function(_0x5af0be){const _0x119467=_0x2a62ce;if(_0x5af0be&&_0x5af0be[_0x119467(0x12a)][_0x119467(0x330)](/<LIST NAME:[ ](.*)>/i)){_0x5af0be[_0x119467(0x1f2)]=String(RegExp['$1'])[_0x119467(0x2dc)]();for(;;){if(_0x5af0be[_0x119467(0x1f2)][_0x119467(0x330)](/\\V\[(\d+)\]/gi))_0x5af0be[_0x119467(0x1f2)]=_0x5af0be[_0x119467(0x1f2)]['replace'](/\\V\[(\d+)\]/gi,(_0x55e229,_0x51b8)=>$gameVariables[_0x119467(0x34a)](parseInt(_0x51b8)));else break;}}},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x2d0)]=function(_0x5e72dc,_0x94a3be,_0x4a1719,_0x4e1d20){const _0x121043=_0x2a62ce;Window_Base[_0x121043(0x151)]['drawSkillCost'][_0x121043(0x107)](this,this['_actor'],_0x5e72dc,_0x94a3be,_0x4a1719,_0x4e1d20);},Window_SkillList[_0x2a62ce(0x151)][_0x2a62ce(0x3c9)]=function(_0x88160f){const _0x473e36=_0x2a62ce;this[_0x473e36(0x3a8)]=_0x88160f,this[_0x473e36(0x2ea)]();},VisuMZ[_0x2a62ce(0x291)][_0x2a62ce(0x29c)]=Window_SkillList[_0x2a62ce(0x151)]['updateHelp'],Window_SkillList[_0x2a62ce(0x151)]['updateHelp']=function(){const _0x2f6db3=_0x2a62ce;VisuMZ[_0x2f6db3(0x291)][_0x2f6db3(0x29c)][_0x2f6db3(0x107)](this),this['_statusWindow']&&this[_0x2f6db3(0x3a8)][_0x2f6db3(0x2ed)]===Window_ShopStatus&&this[_0x2f6db3(0x3a8)][_0x2f6db3(0x213)](this['item']());};
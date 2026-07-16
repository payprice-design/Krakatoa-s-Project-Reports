KRAKATOA PROJECT CARD TEMPLATES
================================

Each folder here represents one project card on the Krakatoa's Projects page.
Use these as a reusable template for adding or editing cards in the future.

FOLDER STRUCTURE
----------------
card-templates/
  _template/                 -> blank card to copy for a new project
  01-paylater-revamp/        -> one folder per project card
  02-kuber-ttd-performance-marketing/
  03-fds-popup-revamp/

Each project folder contains:
  project.txt                -> all the card's text fields
  <avatar image>             -> the team member's round avatar (e.g. Joan.png)
  <card image>               -> optional cover image shown on the card (e.g. FDS.png)

project.txt FIELDS
------------------
TITLE          Card heading.
TEAM           Team member's full name (shown on avatar hover).
TEAM AVATAR    Filename of the avatar image in this folder. Round, ~square crop.
IMAGE          Filename of the card cover image in this folder.
               Leave blank to show the empty image placeholder instead.
DESCRIPTION    Short paragraph. Leave blank to hide the Description block.
IMPACT         Outcome / result. Leave blank to hide the Impact block.
START DATE     Shown under START. Leave blank to show "TBD".
LAUNCH DATE    Shown under LAUNCH. Leave blank to show "TBD".
END DATE       Shown under END. Leave blank to show "TBD".

ADDING A NEW CARD
-----------------
1. Copy the _template/ folder and rename it (e.g. 04-my-project/).
2. Fill in project.txt.
3. Drop the avatar image (and optional cover image) into the folder.
4. Reflect the same values in src/components/FeaturesSection.tsx (PROJECTS array)
   and place the images under public/ (public/team/<avatar>, public/<image>).

NOTES
-----
- Multiple team members: list several avatars; they overlap on the card.
- The ▲ symbol and — em dash in IMPACT are literal characters, keep as-is.

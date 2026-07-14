const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually load env variables from .env.local
const dotenvPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      process.env[key] = val;
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Error: Missing credentials in environment variables!");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

// 2. Multi-line CSV Raw Data provided by user
const csvData = `Content Type,Name,Category,Type,Price,Download Link,Description,License / Copyright Note
Software,GIMP,Graphic Design,Free & Open-Source / Official Free Tier,Free,https://www.gimp.org/downloads/,Free Photoshop alternative for image editing.,Official free/open-source software - 100% legal to share
Software,Inkscape,Graphic Design,Free & Open-Source / Official Free Tier,Free,https://inkscape.org/release/,Free vector graphics editor (Illustrator alternative).,Official free/open-source software - 100% legal to share
Software,Krita,Digital Painting,Free & Open-Source / Official Free Tier,Free,https://krita.org/en/download/,Free digital painting & illustration software.,Official free/open-source software - 100% legal to share
Software,Blender,3D Animation & VFX,Free & Open-Source / Official Free Tier,Free,https://www.blender.org/download/,"Free professional 3D modeling, animation & rendering suite.",Official free/open-source software - 100% legal to share
Software,DaVinci Resolve (Free Edition),Video Editing,Free & Open-Source / Official Free Tier,Free,https://www.blackmagicdesign.com/products/davinciresolve,Official free version of professional color grading & editing software.,Official free/open-source software - 100% legal to share
Software,Shotcut,Video Editing,Free & Open-Source / Official Free Tier,Free,https://shotcut.org/download/,"Free, open-source cross-platform video editor.",Official free/open-source software - 100% legal to share
Software,HandBrake,Video Converter,Free & Open-Source / Official Free Tier,Free,https://handbrake.fr/downloads.php,Free video transcoder/converter tool.,Official free/open-source software - 100% legal to share
Software,VLC Media Player,Media Player,Free & Open-Source / Official Free Tier,Free,https://www.videolan.org/vlc/,"Free, open-source media player supporting all formats.",Official free/open-source software - 100% legal to share
Software,OBS Studio,Screen Recording / Streaming,Free & Open-Source / Official Free Tier,Free,https://obsproject.com/download,Free screen recording & live streaming software.,Official free/open-source software - 100% legal to share
Software,ShareX,Screen Capture,Free & Open-Source / Official Free Tier,Free,https://getsharex.com/,Free screenshot & screen recording tool.,Official free/open-source software - 100% legal to share
Software,Greenshot,Screen Capture,Free & Open-Source / Official Free Tier,Free,https://getgreenshot.org/downloads/,Lightweight free screenshot tool.,Official free/open-source software - 100% legal to share
Software,Audacity,Audio Editing,Free & Open-Source / Official Free Tier,Free,https://www.audacityteam.org/download/,Free audio recording and editing software.,Official free/open-source software - 100% legal to share
Software,LibreOffice,Office Suite,Free & Open-Source / Official Free Tier,Free,https://www.libreoffice.org/download/download/,"Free alternative to MS Office (Writer, Calc, Impress).",Official free/open-source software - 100% legal to share
Software,OnlyOffice Desktop,Office Suite,Free & Open-Source / Official Free Tier,Free,https://www.onlyoffice.com/download-desktop.aspx,Free office suite compatible with MS Office formats.,Official free/open-source software - 100% legal to share
Software,WPS Office (Free),Office Suite,Free & Open-Source / Official Free Tier,Free,https://www.wps.com/,Free office suite with Word/Excel/PowerPoint compatible formats.,Official free/open-source software - 100% legal to share
Software,Notepad++,Text Editor,Free & Open-Source / Official Free Tier,Free,https://notepad-plus-plus.org/downloads/,Free source code & text editor.,Official free/open-source software - 100% legal to share
Software,Visual Studio Code,Code Editor,Free & Open-Source / Official Free Tier,Free,https://code.visualstudio.com/download,"Free, official code editor by Microsoft.",Official free/open-source software - 100% legal to share
Software,FileZilla,FTP Client,Free & Open-Source / Official Free Tier,Free,https://filezilla-project.org/download.php,Free FTP/SFTP client for file transfers.,Official free/open-source software - 100% legal to share
Software,Thunderbird,Email Client,Free & Open-Source / Official Free Tier,Free,https://www.thunderbird.net/en-US/download/,"Free, open-source email client by Mozilla.",Official free/open-source software - 100% legal to share
Software,7-Zip,File Archiver,Free & Open-Source / Official Free Tier,Free,https://www.7-zip.org/download.html,Free file compression/archiving tool.,Official free/open-source software - 100% legal to share
Software,PeaZip,File Archiver,Free & Open-Source / Official Free Tier,Free,https://peazip.github.io/,Free open-source file archiver.,Official free/open-source software - 100% legal to share
Software,PDF24 Creator,PDF Tools,Free & Open-Source / Official Free Tier,Free,https://tools.pdf24.org/en/,"Free PDF creation, editing & conversion tool.",Official free/open-source software - 100% legal to share
Software,Foxit PDF Reader (Free),PDF Tools,Free & Open-Source / Official Free Tier,Free,https://www.foxit.com/pdf-reader/,Free official PDF reader.,Official free/open-source software - 100% legal to share
Software,PDFsam Basic,PDF Tools,Free & Open-Source / Official Free Tier,Free,https://pdfsam.org/download-pdfsam-basic/,"Free tool to split, merge & rotate PDFs.",Official free/open-source software - 100% legal to share
Software,Sumatra PDF,PDF Tools,Free & Open-Source / Official Free Tier,Free,https://www.sumatrapdfreader.org/download-free-pdf-viewer,Lightweight free PDF/ebook reader.,Official free/open-source software - 100% legal to share
Software,IrfanView,Image Viewer,Free & Open-Source / Official Free Tier,Free,https://www.irfanview.com/,"Free, fast image viewer & basic editor.",Official free/open-source software - 100% legal to share
Software,XnView,Image Viewer,Free & Open-Source / Official Free Tier,Free,https://www.xnview.com/en/xnview/#downloads,Free image viewer & batch converter.,Official free/open-source software - 100% legal to share
Software,Paint.NET,Image Editing,Free & Open-Source / Official Free Tier,Free,https://www.getpaint.net/download.html,Free image and photo editing software.,Official free/open-source software - 100% legal to share
Software,FastStone Image Viewer,Image Viewer,Free & Open-Source / Official Free Tier,Free,https://www.faststone.org/FSViewerDownload.htm,Free fast image browser & viewer.,Official free/open-source software - 100% legal to share
Software,Scribus,Desktop Publishing,Free & Open-Source / Official Free Tier,Free,https://www.scribus.net/downloads/,Free InDesign alternative for page layout & publishing.,Official free/open-source software - 100% legal to share
Software,FreeCAD,Engineering / CAD (AutoCAD alternative),Free & Open-Source / Official Free Tier,Free,https://www.freecad.org/downloads.php,Free open-source parametric 3D CAD modeler.,Official free/open-source software - 100% legal to share
Software,LibreCAD,Engineering / CAD (AutoCAD alternative),Free & Open-Source / Official Free Tier,Free,https://librecad.org/,Free 2D CAD drafting software.,Official free/open-source software - 100% legal to share
Software,QGIS,GIS Software (ArcGIS alternative),Free & Open-Source / Official Free Tier,Free,https://qgis.org/download/,"Free, open-source Geographic Information System software.",Official free/open-source software - 100% legal to share
Software,Godot Engine,Game Development,Free & Open-Source / Official Free Tier,Free,https://godotengine.org/download,"Free, open-source game engine (Unity/Unreal alternative).",Official free/open-source software - 100% legal to share
Software,Blender Game Tools,Game Development,Free & Open-Source / Official Free Tier,Free,https://www.blender.org/download/,Free 3D game asset creation tools built into Blender.,Official free/open-source software - 100% legal to share
Software,Bitwarden,Password Manager,Free & Open-Source / Official Free Tier,Free,https://bitwarden.com/download/,"Free, open-source password manager.",Official free/open-source software - 100% legal to share
Software,KeePass,Password Manager,Free & Open-Source / Official Free Tier,Free,https://keepass.info/download.html,Free open-source password manager.,Official free/open-source software - 100% legal to share
Software,Signal,Messaging,Free & Open-Source / Official Free Tier,Free,https://signal.org/download/,"Free, secure, open-source messaging app.",Official free/open-source software - 100% legal to share
Software,Telegram Desktop,Messaging,Free & Open-Source / Official Free Tier,Free,https://desktop.telegram.org/,Free official messaging app for desktop.,Official free/open-source software - 100% legal to share
Software,qBittorrent,Download Manager,Free & Open-Source / Official Free Tier,Free,https://www.qbittorrent.org/download,"Free, open-source torrent client (ad-free).",Official free/open-source software - 100% legal to share
Software,Balena Etcher,USB Tools,Free & Open-Source / Official Free Tier,Free,https://etcher.balena.io/,Free tool to flash OS images to USB drives.,Official free/open-source software - 100% legal to share
Software,Rufus,USB Tools,Free & Open-Source / Official Free Tier,Free,https://rufus.ie/en/,Free tool to create bootable USB drives.,Official free/open-source software - 100% legal to share
Software,CPU-Z,System Utility,Free & Open-Source / Official Free Tier,Free,https://www.cpuid.com/softwares/cpu-z.html,Free system information & diagnostics tool.,Official free/open-source software - 100% legal to share
Software,Speccy,System Utility,Free & Open-Source / Official Free Tier,Free,https://www.ccleaner.com/speccy,Free detailed PC system information tool.,Official free/open-source software - 100% legal to share
Software,CCleaner (Free),System Utility,Free & Open-Source / Official Free Tier,Free,https://www.ccleaner.com/ccleaner/download,Free PC cleaning & optimization tool.,Official free/open-source software - 100% legal to share
Software,Malwarebytes (Free),Antivirus / Security,Free & Open-Source / Official Free Tier,Free,https://www.malwarebytes.com/mwb-download,Free malware removal tool.,Official free/open-source software - 100% legal to share
Software,Avast Free Antivirus,Antivirus / Security,Free & Open-Source / Official Free Tier,Free,https://www.avast.com/free-antivirus-download,Free official antivirus software.,Official free/open-source software - 100% legal to share
Software,Obsidian,Note Taking,Free & Open-Source / Official Free Tier,Free,https://obsidian.md/download,Free note-taking & knowledge management app.,Official free/open-source software - 100% legal to share
Software,Joplin,Note Taking,Free & Open-Source / Official Free Tier,Free,https://joplinapp.org/download/,"Free, open-source note-taking app with sync.",Official free/open-source software - 100% legal to share
Software,Notion (Free Tier),Productivity,Free & Open-Source / Official Free Tier,Free,https://www.notion.so/desktop,Free tier of the popular productivity/notes workspace app.,Official free/open-source software - 100% legal to share
Software,Anydesk (Free),Remote Access,Free & Open-Source / Official Free Tier,Free,https://anydesk.com/en/downloads,Free remote desktop access tool for personal use.,Official free/open-source software - 100% legal to share
Ebook,Pride and Prejudice - Jane Austen,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Pride%20and%20Prejudice,Public domain classic by Jane Austen. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Sense and Sensibility - Jane Austen,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Sense%20and%20Sensibility,Public domain classic by Jane Austen. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Emma - Jane Austen,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Emma,Public domain classic by Jane Austen. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Frankenstein - Mary Shelley,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Frankenstein,Public domain classic by Mary Shelley. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Moby Dick - Herman Melville,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Moby%20Dick,Public domain classic by Herman Melville. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,War and Peace - Leo Tolstoy,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=War%20and%20Peace,Public domain classic by Leo Tolstoy. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Anna Karenina - Leo Tolstoy,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Anna%20Karenina,Public domain classic by Leo Tolstoy. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Crime and Punishment - Fyodor Dostoevsky,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Crime%20and%20Punishment,Public domain classic by Fyodor Dostoevsky. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Brothers Karamazov - Fyodor Dostoevsky,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Brothers%20Karamazov,Public domain classic by Fyodor Dostoevsky. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Adventures of Sherlock Holmes - Arthur Conan Doyle,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Adventures%20of%20Sherlock%20Holmes,Public domain classic by Arthur Conan Doyle. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Dracula - Bram Stoker,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Dracula,Public domain classic by Bram Stoker. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Alice's Adventures in Wonderland - Lewis Carroll,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Alice%27s%20Adventures%20in%20Wonderland,Public domain classic by Lewis Carroll. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Picture of Dorian Gray - Oscar Wilde,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Picture%20of%20Dorian%20Gray,Public domain classic by Oscar Wilde. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,A Tale of Two Cities - Charles Dickens,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=A%20Tale%20of%20Two%20Cities,Public domain classic by Charles Dickens. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Great Expectations - Charles Dickens,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Great%20Expectations,Public domain classic by Charles Dickens. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Oliver Twist - Charles Dickens,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Oliver%20Twist,Public domain classic by Charles Dickens. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,David Copperfield - Charles Dickens,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=David%20Copperfield,Public domain classic by Charles Dickens. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Odyssey - Homer,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Odyssey,Public domain classic by Homer. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Iliad - Homer,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Iliad,Public domain classic by Homer. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Meditations - Marcus Aurelius,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Meditations,Public domain classic by Marcus Aurelius. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Art of War - Sun Tzu,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Art%20of%20War,Public domain classic by Sun Tzu. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Prince - Niccolo Machiavelli,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Prince,Public domain classic by Niccolo Machiavelli. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Common Sense - Thomas Paine,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Common%20Sense,Public domain classic by Thomas Paine. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Republic - Plato,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Republic,Public domain classic by Plato. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Beowulf - Unknown / Anonymous,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Beowulf,Public domain classic by Unknown / Anonymous. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Count of Monte Cristo - Alexandre Dumas,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Count%20of%20Monte%20Cristo,Public domain classic by Alexandre Dumas. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Three Musketeers - Alexandre Dumas,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Three%20Musketeers,Public domain classic by Alexandre Dumas. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Treasure Island - Robert Louis Stevenson,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Treasure%20Island,Public domain classic by Robert Louis Stevenson. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Strange Case of Dr. Jekyll and Mr. Hyde - Robert Louis Stevenson,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Strange%20Case%20of%20Dr.%20Jekyll%20and%20Mr.%20Hyde,Public domain classic by Robert Louis Stevenson. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Time Machine - H.G. Wells,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Time%20Machine,Public domain classic by H.G. Wells. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The War of the Worlds - H.G. Wells,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20War%20of%20the%20Worlds,Public domain classic by H.G. Wells. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Invisible Man - H.G. Wells,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Invisible%20Man,Public domain classic by H.G. Wells. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Wuthering Heights - Emily Bronte,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Wuthering%20Heights,Public domain classic by Emily Bronte. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Jane Eyre - Charlotte Bronte,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Jane%20Eyre,Public domain classic by Charlotte Bronte. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Little Women - Louisa May Alcott,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Little%20Women,Public domain classic by Louisa May Alcott. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Adventures of Tom Sawyer - Mark Twain,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Adventures%20of%20Tom%20Sawyer,Public domain classic by Mark Twain. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Adventures of Huckleberry Finn - Mark Twain,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Adventures%20of%20Huckleberry%20Finn,Public domain classic by Mark Twain. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Grimms' Fairy Tales - Brothers Grimm,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Grimms%27%20Fairy%20Tales,Public domain classic by Brothers Grimm. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Aesop's Fables - Aesop,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Aesop%27s%20Fables,Public domain classic by Aesop. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Wonderful Wizard of Oz - L. Frank Baum,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Wonderful%20Wizard%20of%20Oz,Public domain classic by L. Frank Baum. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Peter Pan - J.M. Barrie,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Peter%20Pan,Public domain classic by J.M. Barrie. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Gulliver's Travels - Jonathan Swift,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Gulliver%27s%20Travels,Public domain classic by Jonathan Swift. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Robinson Crusoe - Daniel Defoe,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Robinson%20Crusoe,Public domain classic by Daniel Defoe. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Don Quixote - Miguel de Cervantes,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Don%20Quixote,Public domain classic by Miguel de Cervantes. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Metamorphosis - Franz Kafka,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Metamorphosis,Public domain classic by Franz Kafka. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Trial - Franz Kafka,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Trial,Public domain classic by Franz Kafka. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Siddhartha - Hermann Hesse,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Siddhartha,Public domain classic by Hermann Hesse. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Walden - Henry David Thoreau,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Walden,Public domain classic by Henry David Thoreau. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Leaves of Grass - Walt Whitman,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Leaves%20of%20Grass,Public domain classic by Walt Whitman. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,"The Federalist Papers - Hamilton, Madison, Jay",Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Federalist%20Papers,"Public domain classic by Hamilton, Madison, Jay. Free to read and share legally.","Public domain - copyright expired, 100% legal to distribute"
Ebook,Democracy in America - Alexis de Tocqueville,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Democracy%20in%20America,Public domain classic by Alexis de Tocqueville. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,On the Origin of Species - Charles Darwin,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=On%20the%20Origin%20of%20Species,Public domain classic by Charles Darwin. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Relativity: The Special and General Theory - Albert Einstein,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Relativity%3A%20The%20Special%20and%20General%20Theory,Public domain classic by Albert Einstein. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Autobiography of Benjamin Franklin - Benjamin Franklin,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Autobiography%20of%20Benjamin%20Franklin,Public domain classic by Benjamin Franklin. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Souls of Black Folk - W.E.B. Du Bois,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Souls%20of%20Black%20Folk,Public domain classic by W.E.B. Du Bois. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Narrative of the Life of Frederick Douglass - Frederick Douglass,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Narrative%20of%20the%20Life%20of%20Frederick%20Douglass,Public domain classic by Frederick Douglass. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Middlemarch - George Eliot,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Middlemarch,Public domain classic by George Eliot. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Vanity Fair - William Makepeace Thackeray,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Vanity%20Fair,Public domain classic by William Makepeace Thackeray. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Madame Bovary - Gustave Flaubert,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Madame%20Bovary,Public domain classic by Gustave Flaubert. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Faust - Johann Wolfgang von Goethe,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Faust,Public domain classic by Johann Wolfgang von Goethe. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,The Scarlet Letter - Nathaniel Hawthorne,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=The%20Scarlet%20Letter,Public domain classic by Nathaniel Hawthorne. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Ebook,Twenty Thousand Leagues Under the Sea - Jules Verne,Ebooks - Public Domain Classic,Free (Public Domain),Free,https://www.gutenberg.org/ebooks/search/?query=Twenty%20Thousand%20Leagues%20Under%20the%20Sea,Public domain classic by Jules Verne. Free to read and share legally.,"Public domain - copyright expired, 100% legal to distribute"
Course,freeCodeCamp - Full Curriculum,Web Development,Free (Official Platform),Free,https://www.freecodecamp.org/learn,"Free certifications in web dev, JS, Python, data science & more.",Official free course/platform - legal to recommend & link
Course,Khan Academy - Full Curriculum,General Education,Free (Official Platform),Free,https://www.khanacademy.org/,"Free courses: math, science, computing, economics, arts & humanities.",Official free course/platform - legal to recommend & link
Course,MIT OpenCourseWare,Computer Science / Engineering,Free (Official Platform),Free,https://ocw.mit.edu/,Free MIT course materials across all departments.,Official free course/platform - legal to recommend & link
Course,Harvard CS50 (edX),Computer Science,Free (Official Platform),Free,https://cs50.harvard.edu/x/,Harvard's free intro to computer science course.,Official free course/platform - legal to recommend & link
Course,Google Digital Garage,Digital Marketing,Free (Official Platform),Free,https://learndigital.withgoogle.com/digitalgarage,Free digital marketing & career skills courses by Google.,Official free course/platform - legal to recommend & link
Course,Coursera (Audit Free Courses),Various,Free (Official Platform),Free,https://www.coursera.org/courses?query=free,Thousands of courses available to audit for free.,Official free course/platform - legal to recommend & link
Course,edX (Free Audit Track),Various,Free (Official Platform),Free,https://www.edx.org/search?tab=course&availability=Available%20now&price=Free,"University-level courses, free audit option available.",Official free course/platform - legal to recommend & link
Course,Codecademy Free Tier,Programming,Free (Official Platform),Free,https://www.codecademy.com/catalog,Free interactive coding lessons across many languages.,Official free course/platform - legal to recommend & link
Course,W3Schools,Web Development,Free (Official Platform),Free,https://www.w3schools.com/,"Free HTML, CSS, JavaScript & web dev tutorials.",Official free course/platform - legal to recommend & link
Course,Google Analytics Academy,Digital Marketing,Free (Official Platform),Free,https://skillshop.withgoogle.com/,Free Google Analytics & marketing certification courses.,Official free course/platform - legal to recommend & link
Course,HubSpot Academy,Marketing / Sales,Free (Official Platform),Free,https://academy.hubspot.com/,"Free marketing, sales & CRM certification courses.",Official free course/platform - legal to recommend & link
Course,Meta Blueprint,Social Media Marketing,Free (Official Platform),Free,https://www.facebookblueprint.com/,Free official Meta/Facebook/Instagram marketing courses.,Official free course/platform - legal to recommend & link
Course,Alison,Various,Free (Official Platform),Free,https://alison.com/,Free online courses & certificates across many subjects.,Official free course/platform - legal to recommend & link
Course,Udacity Free Courses,Tech / Programming,Free (Official Platform),Free,https://www.udacity.com/courses/all,Selected free courses in programming & tech skills.,Official free course/platform - legal to recommend & link
Course,Class Central,Course Aggregator,Free (Official Platform),Free,https://www.classcentral.com/,Search engine for free online courses from all platforms.,Official free course/platform - legal to recommend & link
Course,OpenLearn (Open University UK),Various,Free (Official Platform),Free,https://www.open.edu/openlearn/,"Free courses from The Open University, UK.",Official free course/platform - legal to recommend & link
Course,Stanford Online (Free Courses),Computer Science / Various,Free (Official Platform),Free,https://online.stanford.edu/free-courses,Free courses from Stanford University.,Official free course/platform - legal to recommend & link
Course,IBM SkillsBuild,Tech / AI / Data,Free (Official Platform),Free,https://skillsbuild.org/,"Free IBM courses in AI, cloud, cybersecurity & data.",Official free course/platform - legal to recommend & link
Course,Cisco Networking Academy,Networking / IT,Free (Official Platform),Free,https://www.netacad.com/,Free networking & cybersecurity courses by Cisco.,Official free course/platform - legal to recommend & link
Course,Microsoft Learn,Tech / Cloud / AI,Free (Official Platform),Free,https://learn.microsoft.com/en-us/training/,Free official Microsoft technical training.,Official free course/platform - legal to recommend & link
Course,AWS Skill Builder (Free Tier),Cloud Computing,Free (Official Platform),Free,https://skillbuilder.aws/,Free AWS cloud computing courses.,Official free course/platform - legal to recommend & link
Course,Google Cloud Skills Boost (Free Labs),Cloud Computing,Free (Official Platform),Free,https://www.cloudskillsboost.google/,Free Google Cloud training & hands-on labs.,Official free course/platform - legal to recommend & link
Course,Duolingo,Language Learning,Free (Official Platform),Free,https://www.duolingo.com/,Free language learning app - 40+ languages.,Official free course/platform - legal to recommend & link
Course,CS50's Web Programming (edX),Web Development,Free (Official Platform),Free,https://cs50.harvard.edu/web/,Harvard's free course on web programming with Python & JS.,Official free course/platform - legal to recommend & link
Course,Khan Academy - Computer Programming,Programming,Free (Official Platform),Free,https://www.khanacademy.org/computing/computer-programming,"Free intro to JS, HTML/CSS & SQL.",Official free course/platform - legal to recommend & link
Course,Khan Academy - Economics & Finance,Business / Finance,Free (Official Platform),Free,https://www.khanacademy.org/economics-finance-domain,Free micro/macroeconomics & personal finance courses.,Official free course/platform - legal to recommend & link
Course,MIT OCW - Linear Algebra,Mathematics,Free (Official Platform),Free,https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/,Free MIT linear algebra course by Gilbert Strang.,Official free course/platform - legal to recommend & link
Course,MIT OCW - Intro to CS (6.0001),Computer Science,Free (Official Platform),Free,https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/,Free MIT intro to Python programming course.,Official free course/platform - legal to recommend & link
Course,"Coursera - Machine Learning (Andrew Ng, audit)",Data Science / AI,Free (Official Platform),Free,https://www.coursera.org/learn/machine-learning,"Legendary ML course, free to audit.",Official free course/platform - legal to recommend & link
Course,Coursera - Python for Everybody (audit),Programming,Free (Official Platform),Free,https://www.coursera.org/specializations/python,Free-to-audit Python course by University of Michigan.,Official free course/platform - legal to recommend & link
Course,YouTube - freeCodeCamp Channel,Programming (Video Courses),Free (Official Platform),Free,https://www.youtube.com/@freecodecamp,Full-length free programming courses on YouTube.,Official free course/platform - legal to recommend & link
Course,YouTube - Traversy Media,Web Development (Video Courses),Free (Official Platform),Free,https://www.youtube.com/@TraversyMedia,Free web development tutorials & crash courses.,Official free course/platform - legal to recommend & link
Course,YouTube - The Net Ninja,Web Development (Video Courses),Free (Official Platform),Free,https://www.youtube.com/@NetNinja,Free web dev & programming tutorial series.,Official free course/platform - legal to recommend & link
Course,YouTube - Programming with Mosh,Programming (Video Courses),Free (Official Platform),Free,https://www.youtube.com/@programmingwithmosh,Free programming crash courses.,Official free course/platform - legal to recommend & link
Course,Khan Academy - Art History,Arts & Humanities,Free (Official Platform),Free,https://www.khanacademy.org/humanities/art-history,Free art history courses.,Official free course/platform - legal to recommend & link
Course,Google Skillshop - Ads Certification,Digital Marketing,Free (Official Platform),Free,https://skillshop.withgoogle.com/,Free Google Ads certification courses.,Official free course/platform - legal to recommend & link
Course,SkillsFuture / Coursera for Business (Free tracks),Business Skills,Free (Official Platform),Free,https://www.coursera.org/business,Selected free business skill courses.,Official free course/platform - legal to recommend & link
Course,Khan Academy - Physics,Science,Free (Official Platform),Free,https://www.khanacademy.org/science/physics,Free complete physics course.,Official free course/platform - legal to recommend & link
Course,Khan Academy - Biology,Science,Free (Official Platform),Free,https://www.khanacademy.org/science/biology,Free complete biology course.,Official free course/platform - legal to recommend & link
Course,Khan Academy - Chemistry,Science,Free (Official Platform),Free,https://www.khanacademy.org/science/chemistry,Free complete chemistry course.,Official free course/platform - legal to recommend & link
Course,edX - CS50's Introduction to AI with Python,AI / Computer Science,Free (Official Platform),Free,https://cs50.harvard.edu/ai/,Harvard's free course on AI with Python.,Official free course/platform - legal to recommend & link
Course,Great Learning Free Courses,Data Science / AI / Business,Free (Official Platform),Free,https://www.mygreatlearning.com/academy,Free certificate courses in tech & business.,Official free course/platform - legal to recommend & link
Course,"Coursera - Financial Markets (Yale, audit)",Finance,Free (Official Platform),Free,https://www.coursera.org/learn/financial-markets-global,Free-to-audit Yale finance course.,Official free course/platform - legal to recommend & link
Course,FutureLearn (Free Courses),Various,Free (Official Platform),Free,https://www.futurelearn.com/courses?availability_status=available,Free short courses from top universities.,Official free pool - legal to recommend
Course,Kaggle Learn,Data Science / Machine Learning,Free (Official Platform),Free,https://www.kaggle.com/learn,Free micro-courses in data science & ML.,Official free course/platform - legal to recommend & link
Course,freeCodeCamp - Data Analysis with Python,Data Science,Free (Official Platform),Free,https://www.freecodecamp.org/learn/data-analysis-with-python/,Free certification in Python data analysis.,Official free course/platform - legal to recommend & link
Course,freeCodeCamp - Scientific Computing with Python,Programming,Free (Official Platform),Free,https://www.freecodecamp.org/learn/scientific-computing-with-python/,Free certification in Python fundamentals.,Official free course/platform - legal to recommend & link
Course,Google UX Design (Audit on Coursera),Design,Free (Official Platform),Free,https://www.coursera.org/professional-certificates/google-ux-design,Free-to-audit UX design course by Google.,Official free course/platform - legal to recommend & link
Course,Meta Front-End Developer (Audit on Coursera),Web Development,Free (Official Platform),Free,https://www.meta.com/courses/,Free-to-audit front-end web dev course by Meta.,Official free course/platform - legal to recommend & link
Course,IBM Data Science (Audit on Coursera),Data Science,Free (Official Platform),Free,https://www.coursera.org/professional-certificates/ibm-data-science,Free-to-audit data science course by IBM.,Official free course/platform - legal to recommend & link
`;

// Parse robust CSV rows
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
}

async function runSeed() {
  console.log("--- Starting Catalog Seeding ---");
  const lines = csvData.trim().split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);

  const itemsToInsert = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    if (fields.length < 7) {
      console.log(`⚠️ Skipping line ${i+2} due to invalid columns limit.`);
      continue;
    }

    const contentType = fields[0];
    const rawName = fields[1];
    const category = fields[2];
    const rawType = fields[3];
    const priceStr = fields[4];
    const downloadUrl = fields[5];
    const rawDescription = fields[6];
    const licenseNote = fields[7] || '';

    // Mapping resource types
    let resource_type = 'book';
    if (contentType.toLowerCase() === 'software') {
      resource_type = 'software';
    } else if (contentType.toLowerCase() === 'course') {
      resource_type = 'course';
    } else if (contentType.toLowerCase() === 'ebook') {
      resource_type = 'book';
    }

    // Extract Title & Author
    let title = rawName;
    let author = 'Official Community';

    if (resource_type === 'book') {
      // Format: Pride and Prejudice - Jane Austen
      const hyphenIndex = rawName.indexOf(' - ');
      if (hyphenIndex !== -1) {
        title = rawName.substring(0, hyphenIndex).trim();
        author = rawName.substring(hyphenIndex + 3).trim();
      } else {
        author = 'Classic Literature';
      }
    } else if (resource_type === 'course') {
      // Format: freeCodeCamp - Full Curriculum
      const hyphenIndex = rawName.indexOf(' - ');
      if (hyphenIndex !== -1) {
        author = rawName.substring(0, hyphenIndex).trim();
        title = rawName.substring(hyphenIndex + 3).trim();
      } else {
        author = 'E-Learning Platform';
      }
    } else if (resource_type === 'software') {
      // Set custom authors for known software providers
      if (rawName.toLowerCase().includes('microsoft') || rawName.toLowerCase().includes('visual studio')) {
        author = 'Microsoft';
      } else if (rawName.toLowerCase().includes('mozilla') || rawName.toLowerCase().includes('thunderbird')) {
        author = 'Mozilla Foundation';
      } else if (rawName.toLowerCase().includes('libreoffice')) {
        author = 'The Document Foundation';
      } else if (rawName.toLowerCase().includes('foxit')) {
        author = 'Foxit Software';
      } else if (rawName.toLowerCase().includes('adobe') || rawName.toLowerCase().includes('gimp')) {
        author = 'GIMP Project';
      } else if (rawName.toLowerCase().includes('blender')) {
        author = 'Blender Foundation';
      } else if (rawName.toLowerCase().includes('inkscape')) {
        author = 'Inkscape Community';
      } else if (rawName.toLowerCase().includes('krita')) {
        author = 'Krita Foundation';
      } else if (rawName.toLowerCase().includes('anydesk')) {
        author = 'AnyDesk GmbH';
      } else if (rawName.toLowerCase().includes('notion')) {
        author = 'Notion Labs';
      } else if (rawName.toLowerCase().includes('obsidian')) {
        author = 'Obsidian team';
      } else {
        author = 'Open-Source Community';
      }
    }

    // Prepare Description
    let description = rawDescription;
    if (licenseNote) {
      description += `\n\n[License Info: ${licenseNote}]`;
    }

    itemsToInsert.push({
      title,
      author,
      category,
      type: 'free',
      price: 0,
      file_path: downloadUrl,
      description,
      resource_type,
      cover_url: null,
      views: 0,
      downloads: 0
    });
  }

  console.log(`Parsed ${itemsToInsert.length} items to insert.`);

  // Upload in batches of 30 to avoid request length limits
  const BATCH_SIZE = 30;
  for (let i = 0; i < itemsToInsert.length; i += BATCH_SIZE) {
    const batch = itemsToInsert.slice(i, i + BATCH_SIZE);
    console.log(`Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
    
    const { error } = await supabase
      .from('items')
      .insert(batch);

    if (error) {
      console.error("❌ Batch Upload Failed:", error.message);
    } else {
      console.log(`✅ Uploaded batch successfully!`);
    }
  }

  console.log("--- Seeding Completed! ---");
}

runSeed();

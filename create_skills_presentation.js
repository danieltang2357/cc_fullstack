const PptxGenJS = require('pptxgenjs');

// Initialize presentation
const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Claude Code';
pres.title = 'How to Use Skills in Claude Code';

// Color palette - Teal Trust
const colors = {
  primary: '028090',    // teal
  secondary: '00A896',  // seafoam
  accent: '02C39A',     // mint
  dark: '014F5C',       // deep teal
  light: 'F8F9FA',      // off-white
  white: 'FFFFFF',
  text: '212529'        // dark gray
};

// ==================== SLIDE 1: TITLE ====================
const slide1 = pres.addSlide();
slide1.background = { color: colors.primary };

slide1.addText('How to Use Skills in Claude Code', {
  x: 0.5,
  y: 2.5,
  w: 12,
  h: 1.5,
  fontSize: 48,
  bold: true,
  color: colors.white,
  align: 'center'
});

slide1.addText('Supercharge Your Workflow with Specialized Capabilities', {
  x: 0.5,
  y: 4.2,
  w: 12,
  h: 0.5,
  fontSize: 20,
  color: colors.accent,
  align: 'center',
  italic: true
});

slide1.addText('Created with Claude Code PPTX Skill', {
  x: 0.5,
  y: 6.8,
  w: 12,
  h: 0.3,
  fontSize: 12,
  color: colors.light,
  align: 'center'
});

// ==================== SLIDE 2: WHAT ARE SKILLS ====================
const slide2 = pres.addSlide();
slide2.background = { color: colors.light };

slide2.addText('What are Skills?', {
  x: 0.5,
  y: 0.5,
  w: 12,
  h: 0.8,
  fontSize: 40,
  bold: true,
  color: colors.primary
});

// Add circular icon placeholder (using shape)
slide2.addShape('circle', {
  x: 0.8,
  y: 1.8,
  w: 0.4,
  h: 0.4,
  fill: { color: colors.secondary }
});

slide2.addText('Domain Expertise', {
  x: 1.4,
  y: 1.7,
  w: 5,
  h: 0.4,
  fontSize: 22,
  bold: true,
  color: colors.text
});

slide2.addText('Skills are specialized prompts that give Claude deep knowledge in specific domains like document processing, web development, or data analysis.', {
  x: 1.4,
  y: 2.15,
  w: 5,
  h: 1,
  fontSize: 14,
  color: colors.text
});

slide2.addShape('circle', {
  x: 0.8,
  y: 3.5,
  w: 0.4,
  h: 0.4,
  fill: { color: colors.secondary }
});

slide2.addText('Automatic Activation', {
  x: 1.4,
  y: 3.4,
  w: 5,
  h: 0.4,
  fontSize: 22,
  bold: true,
  color: colors.text
});

slide2.addText('Skills activate automatically when relevant to your task—no need to manually invoke them each time.', {
  x: 1.4,
  y: 3.85,
  w: 5,
  h: 1,
  fontSize: 14,
  color: colors.text
});

slide2.addShape('circle', {
  x: 0.8,
  y: 5.2,
  w: 0.4,
  h: 0.4,
  fill: { color: colors.secondary }
});

slide2.addText('Best Practices Built-In', {
  x: 1.4,
  y: 5.1,
  w: 5,
  h: 0.4,
  fontSize: 22,
  bold: true,
  color: colors.text
});

slide2.addText('Each skill includes workflows, tools, and QA processes refined by experts to ensure high-quality results.', {
  x: 1.4,
  y: 5.55,
  w: 5,
  h: 1,
  fontSize: 14,
  color: colors.text
});

// Right side visual element
slide2.addShape('roundRect', {
  x: 7.5,
  y: 1.5,
  w: 5,
  h: 5,
  fill: { color: colors.primary },
  rectRadius: 0.2
});

slide2.addText('💡', {
  x: 7.5,
  y: 2.5,
  w: 5,
  h: 1,
  fontSize: 80,
  align: 'center'
});

slide2.addText('Skills = Claude\'s\nSuperpower', {
  x: 7.5,
  y: 4.2,
  w: 5,
  h: 1,
  fontSize: 28,
  bold: true,
  color: colors.white,
  align: 'center'
});

// ==================== SLIDE 3: INSTALLING SKILLS ====================
const slide3 = pres.addSlide();
slide3.background = { color: colors.light };

slide3.addText('Installing Skills', {
  x: 0.5,
  y: 0.5,
  w: 12,
  h: 0.8,
  fontSize: 40,
  bold: true,
  color: colors.primary
});

slide3.addText('Three Simple Steps', {
  x: 0.5,
  y: 1.4,
  w: 12,
  h: 0.4,
  fontSize: 18,
  color: colors.secondary,
  italic: true
});

// Step 1
slide3.addShape('roundRect', {
  x: 0.8,
  y: 2.2,
  w: 11.4,
  h: 1.2,
  fill: { color: colors.white },
  rectRadius: 0.15
});

slide3.addText('1', {
  x: 1,
  y: 2.5,
  w: 0.6,
  h: 0.6,
  fontSize: 32,
  bold: true,
  color: colors.primary,
  align: 'center'
});

slide3.addText('Add the Marketplace', {
  x: 2,
  y: 2.4,
  w: 9.5,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: colors.text
});

slide3.addText('claude plugin marketplace add <path-or-url>', {
  x: 2,
  y: 2.85,
  w: 9.5,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Consolas',
  color: colors.dark
});

// Step 2
slide3.addShape('roundRect', {
  x: 0.8,
  y: 3.7,
  w: 11.4,
  h: 1.2,
  fill: { color: colors.white },
  rectRadius: 0.15
});

slide3.addText('2', {
  x: 1,
  y: 4,
  w: 0.6,
  h: 0.6,
  fontSize: 32,
  bold: true,
  color: colors.primary,
  align: 'center'
});

slide3.addText('Install the Plugin', {
  x: 2,
  y: 3.9,
  w: 9.5,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: colors.text
});

slide3.addText('claude plugin install <plugin-name>@<marketplace>', {
  x: 2,
  y: 4.35,
  w: 9.5,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Consolas',
  color: colors.dark
});

// Step 3
slide3.addShape('roundRect', {
  x: 0.8,
  y: 5.2,
  w: 11.4,
  h: 1.2,
  fill: { color: colors.white },
  rectRadius: 0.15
});

slide3.addText('3', {
  x: 1,
  y: 5.5,
  w: 0.6,
  h: 0.6,
  fontSize: 32,
  bold: true,
  color: colors.primary,
  align: 'center'
});

slide3.addText('Start Using It!', {
  x: 2,
  y: 5.4,
  w: 9.5,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: colors.text
});

slide3.addText('Skills activate automatically when relevant—no manual invocation needed', {
  x: 2,
  y: 5.85,
  w: 9.5,
  h: 0.4,
  fontSize: 14,
  color: colors.text
});

// ==================== SLIDE 4: REAL EXAMPLE ====================
const slide4 = pres.addSlide();
slide4.background = { color: colors.light };

slide4.addText('Real Example: Installing PPTX Skill', {
  x: 0.5,
  y: 0.5,
  w: 12,
  h: 0.8,
  fontSize: 40,
  bold: true,
  color: colors.primary
});

// Terminal window mockup
slide4.addShape('roundRect', {
  x: 1,
  y: 1.8,
  w: 11,
  h: 4.5,
  fill: { color: '1E1E1E' },
  rectRadius: 0.2
});

// Terminal header
slide4.addShape('roundRect', {
  x: 1,
  y: 1.8,
  w: 11,
  h: 0.4,
  fill: { color: '2D2D30' },
  rectRadius: 0.2
});

slide4.addText('Terminal', {
  x: 1.2,
  y: 1.85,
  w: 2,
  h: 0.3,
  fontSize: 12,
  color: colors.light,
  margin: 0
});

// Terminal commands
const commands = [
  '$ claude plugin marketplace add ~/.claude/plugins/skills/anthropics-skills',
  '✔ Successfully added marketplace: anthropic-agent-skills',
  '',
  '$ claude plugin install document-skills@anthropic-agent-skills',
  '✔ Successfully installed plugin: document-skills@anthropic-agent-skills',
  '',
  '# The pptx skill is now available!',
  '# It includes: pptx, docx, xlsx, and pdf skills'
];

slide4.addText(commands.join('\n'), {
  x: 1.3,
  y: 2.4,
  w: 10.4,
  h: 3.7,
  fontSize: 12,
  fontFace: 'Consolas',
  color: '4EC9B0',
  valign: 'top',
  margin: 0
});

// ==================== SLIDE 5: USING SKILLS ====================
const slide5 = pres.addSlide();
slide5.background = { color: colors.light };

slide5.addText('Using Skills in Practice', {
  x: 0.5,
  y: 0.5,
  w: 12,
  h: 0.8,
  fontSize: 40,
  bold: true,
  color: colors.primary
});

// Left column - PPTX Skill
slide5.addShape('roundRect', {
  x: 0.8,
  y: 1.7,
  w: 5.5,
  h: 5,
  fill: { color: colors.white },
  rectRadius: 0.2
});

slide5.addShape('roundRect', {
  x: 0.8,
  y: 1.7,
  w: 5.5,
  h: 0.7,
  fill: { color: colors.primary },
  rectRadius: 0.2
});

slide5.addText('📊 PPTX Skill', {
  x: 0.8,
  y: 1.85,
  w: 5.5,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: colors.white,
  align: 'center'
});

slide5.addText('Capabilities:', {
  x: 1.2,
  y: 2.7,
  w: 4.7,
  h: 0.3,
  fontSize: 16,
  bold: true,
  color: colors.text
});

const pptxFeatures = [
  '• Create presentations from scratch',
  '• Edit existing templates',
  '• Extract text and analyze content',
  '• Professional design guidelines',
  '• Automated QA processes'
];

slide5.addText(pptxFeatures.join('\n'), {
  x: 1.2,
  y: 3.1,
  w: 4.7,
  h: 2.5,
  fontSize: 13,
  color: colors.text,
  lineSpacing: 24
});

slide5.addText('Trigger: Any .pptx file or\nslide/deck mention', {
  x: 1.2,
  y: 5.8,
  w: 4.7,
  h: 0.6,
  fontSize: 11,
  color: colors.secondary,
  italic: true
});

// Right column - Other Skills
slide5.addShape('roundRect', {
  x: 6.7,
  y: 1.7,
  w: 5.5,
  h: 5,
  fill: { color: colors.white },
  rectRadius: 0.2
});

slide5.addShape('roundRect', {
  x: 6.7,
  y: 1.7,
  w: 5.5,
  h: 0.7,
  fill: { color: colors.secondary },
  rectRadius: 0.2
});

slide5.addText('🎯 More Skills Available', {
  x: 6.7,
  y: 1.85,
  w: 5.5,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: colors.white,
  align: 'center'
});

const otherSkills = [
  '📄 DOCX - Word documents',
  '📊 XLSX - Excel spreadsheets',
  '📑 PDF - PDF processing',
  '🎨 Canvas Design - UI/UX',
  '🌐 Web Artifacts - Build apps',
  '🤖 MCP Builder - Create servers',
  '💬 Slack GIF - GIF creation'
];

slide5.addText(otherSkills.join('\n\n'), {
  x: 7.1,
  y: 2.8,
  w: 4.7,
  h: 3.5,
  fontSize: 14,
  color: colors.text,
  lineSpacing: 28
});

// ==================== SLIDE 6: TIPS & BEST PRACTICES ====================
const slide6 = pres.addSlide();
slide6.background = { color: colors.light };

slide6.addText('Tips & Best Practices', {
  x: 0.5,
  y: 0.5,
  w: 12,
  h: 0.8,
  fontSize: 40,
  bold: true,
  color: colors.primary
});

// 2x2 Grid
const tips = [
  {
    icon: '✨',
    title: 'Let Skills Activate Naturally',
    desc: 'Don\'t manually invoke skills—just describe what you want and let Claude choose the right skill'
  },
  {
    icon: '🔍',
    title: 'Trust the Process',
    desc: 'Skills include built-in QA and verification steps. Follow their workflows for best results'
  },
  {
    icon: '📚',
    title: 'Check Skill Documentation',
    desc: 'Each skill has a SKILL.md file with detailed usage instructions and examples'
  },
  {
    icon: '🔄',
    title: 'Keep Skills Updated',
    desc: 'Pull marketplace updates regularly to get the latest improvements and fixes'
  }
];

const positions = [
  { x: 0.8, y: 2 },
  { x: 6.7, y: 2 },
  { x: 0.8, y: 4.5 },
  { x: 6.7, y: 4.5 }
];

tips.forEach((tip, i) => {
  const pos = positions[i];

  slide6.addShape('roundRect', {
    x: pos.x,
    y: pos.y,
    w: 5.5,
    h: 2.2,
    fill: { color: colors.white },
    rectRadius: 0.2
  });

  slide6.addText(tip.icon, {
    x: pos.x + 0.3,
    y: pos.y + 0.2,
    w: 0.8,
    h: 0.8,
    fontSize: 36
  });

  slide6.addText(tip.title, {
    x: pos.x + 0.3,
    y: pos.y + 1,
    w: 4.9,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.text
  });

  slide6.addText(tip.desc, {
    x: pos.x + 0.3,
    y: pos.y + 1.45,
    w: 4.9,
    h: 0.6,
    fontSize: 12,
    color: colors.text
  });
});

// ==================== SLIDE 7: CONCLUSION ====================
const slide7 = pres.addSlide();
slide7.background = { color: colors.dark };

slide7.addText('Start Using Skills Today', {
  x: 0.5,
  y: 2,
  w: 12,
  h: 1,
  fontSize: 44,
  bold: true,
  color: colors.white,
  align: 'center'
});

slide7.addShape('roundRect', {
  x: 2,
  y: 3.5,
  w: 9,
  h: 2,
  fill: { color: colors.primary },
  rectRadius: 0.2
});

slide7.addText('Skills Repository:', {
  x: 2,
  y: 3.8,
  w: 9,
  h: 0.4,
  fontSize: 18,
  color: colors.light,
  align: 'center'
});

slide7.addText('github.com/anthropics/skills', {
  x: 2,
  y: 4.3,
  w: 9,
  h: 0.5,
  fontSize: 24,
  bold: true,
  color: colors.accent,
  align: 'center'
});

slide7.addText('Transform your Claude Code experience with specialized expertise', {
  x: 0.5,
  y: 6,
  w: 12,
  h: 0.5,
  fontSize: 16,
  color: colors.accent,
  align: 'center',
  italic: true
});

slide7.addText('This presentation was created using the PPTX skill! 🎉', {
  x: 0.5,
  y: 6.7,
  w: 12,
  h: 0.3,
  fontSize: 13,
  color: colors.light,
  align: 'center'
});

// Save presentation
pres.writeFile({ fileName: 'How_to_Use_Skills.pptx' })
  .then(() => {
    console.log('✔ Presentation created successfully: How_to_Use_Skills.pptx');
  })
  .catch((err) => {
    console.error('Error creating presentation:', err);
    process.exit(1);
  });

import pptxgen from 'pptxgenjs';

export function generatePptxFile({ title, subject, teacherName, targetClass, slides }) {
  const pptx = new pptxgen();

  // Set Widescreen 16:9 Layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = teacherName || 'Prof. Sarah Khan';
  pptx.company = 'Apex Digital School System';
  pptx.title = title;

  // Slide 1: Title Slide (Dark Stylish Theme)
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' }; // Dark Slate

  // Header Decorative Accent Bar
  slide1.addShape(pptx.shapes.RECTANGLE, { 
    x: 0, y: 0, w: '100%', h: 0.15, fill: { color: '6366F1' } 
  });

  // School Badge / Header
  slide1.addText('APEX DIGITAL SCHOOL SYSTEM • AI ACADEMIC LAYER', {
    x: 0.8, y: 0.8, w: 8.5, h: 0.4,
    fontSize: 12, color: '818CF8', bold: true, tracking: 1
  });

  // Main Presentation Title
  slide1.addText(title || 'Academic Lecture Presentation', {
    x: 0.8, y: 1.8, w: 11.5, h: 1.8,
    fontSize: 32, color: 'FFFFFF', bold: true, wrap: true
  });

  // Subtitle
  slide1.addText(`Subject: ${subject || 'Physics & Mathematics'} • Target Class: ${targetClass || 'Class 9-A'}`, {
    x: 0.8, y: 3.8, w: 10, h: 0.6,
    fontSize: 16, color: '94A3B8'
  });

  // Presenter Footer
  slide1.addText(`Presented by: ${teacherName || 'Faculty Instructor'}  |  Date: ${new Date().toLocaleDateString()}`, {
    x: 0.8, y: 6.2, w: 10, h: 0.5,
    fontSize: 13, color: '64748B', italic: true
  });


  // Loop through remaining slides content
  (slides || []).forEach((slideData, idx) => {
    const s = pptx.addSlide();
    s.background = { color: 'F8FAFC' };

    // Top Banner Bar
    s.addShape(pptx.shapes.RECTANGLE, { 
      x: 0, y: 0, w: '100%', h: 1.1, fill: { color: '1E1B4B' } 
    });

    // Slide Title
    s.addText(`Slide ${idx + 1}: ${slideData.title}`, {
      x: 0.8, y: 0.25, w: 11, h: 0.6,
      fontSize: 22, color: 'FFFFFF', bold: true
    });

    // Slide Badge / Header Subtitle
    s.addText(`${subject} • Class 9-A`, {
      x: 9.5, y: 0.35, w: 3, h: 0.4,
      fontSize: 11, color: 'A5B4FC', align: 'right'
    });

    // Slide Body Content Box
    if (slideData.bullets && slideData.bullets.length > 0) {
      s.addText(
        slideData.bullets.map(b => ({ text: b, options: { bullet: true, fontSize: 16, color: '334155', breakLine: true } })),
        { x: 0.8, y: 1.6, w: 11.5, h: 4.8, lineSpacing: 28 }
      );
    } else if (slideData.content) {
      s.addText(slideData.content, {
        x: 0.8, y: 1.6, w: 11.5, h: 4.8,
        fontSize: 16, color: '334155', lineSpacing: 26
      });
    }

    // Bottom Decorative Footer
    s.addShape(pptx.shapes.RECTANGLE, { 
      x: 0, y: 7.0, w: '100%', h: 0.5, fill: { color: 'E2E8F0' } 
    });
    s.addText('Apex Digital School System • Confidential Academic Deck', {
      x: 0.8, y: 7.1, w: 8, h: 0.3,
      fontSize: 10, color: '64748B'
    });
    s.addText(`Slide ${idx + 1} of ${slides.length}`, {
      x: 10, y: 7.1, w: 2.5, h: 0.3,
      fontSize: 10, color: '64748B', align: 'right'
    });
  });

  // Save File
  const safeFilename = (title || 'Lecture_Presentation').replace(/[^a-z0-9]/gi, '_') + '.pptx';
  pptx.writeFile({ fileName: safeFilename });
}

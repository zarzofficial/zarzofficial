const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// replace <section to <Section (except where I defined `const Section` or `<section id={id}`)
content = content.replace(/<section (className|id)=/g, '<Section $1=');
content = content.replace(/<\/section>/g, '</Section>');

// restore the inner `<section>` in the Section component definition
content = content.replace(/<Section id=\{id\} className=\{className\} \{\.\.\.props\}>/, '<section id={id} className={className} {...props}>');
content = content.replace(/\{\n          \{children\}\n        \}<\/Section>/, '{\n          {children}\n        }</section>');

// wrap FeaturedProducts
content = content.replace('<FeaturedProducts />', '<IsolatedSection>\n        <FeaturedProducts />\n      </IsolatedSection>');

// wrap tech marquee
content = content.replace('<div className="z-20 w-full max-w-6xl mx-auto pt-4 pb-12 md:pt-10 md:pb-20 relative">', '<IsolatedSection>\n      <div className="z-20 w-full max-w-6xl mx-auto pt-4 pb-12 md:pt-10 md:pb-20 relative">');
content = content.replace('      {/* Stats Section */}', '      </IsolatedSection>\n\n      {/* Stats Section */}');

// The Tech Marquee has an ending div that we need to wrap properly. 
// Instead of replacing </div>, I'll just find the "Stats Section" comment and put the </IsolatedSection> right before it, 
// wait, the marquee section wrapper has `</div>` at the end! 
// If I wrap it like `<IsolatedSection><div...></IsolatedSection>`, I must close the IsolatedSection after the closing `</div>` of the marquee.
// The marquee section ends just before `{/* Stats Section */}`. Let's see standard Home.tsx.

fs.writeFileSync('src/pages/Home.tsx', content);

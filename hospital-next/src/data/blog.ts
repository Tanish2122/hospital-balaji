export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "3d-laparoscopy",
    title: "3D Laparoscopy: The Future of Minimally Invasive Surgery",
    excerpt:
      "Discover how 3D technology is revolutionising minimally invasive procedures, offering surgeons unparalleled depth perception for safer and faster surgeries.",
    author: "Hospital Editorial",
    date: "Mar 10, 2024",
    category: "Surgical Innovation",
    image:
      "https://balajihospitaljaipur.com/uploads/blog/1757917102-3D-LAPROSCOPY-SURGERY.jpg",
    content: `
      <p>Laparoscopy — also known as minimally invasive surgery — has long been a game-changer in medicine. The introduction of 3D technology has taken this revolution to the next level. At Balaji Hospital, we are proud to offer advanced 3D Laparoscopic surgeries, providing our patients with unprecedented precision and compassionate care.</p>

      <h2>What is 3D Laparoscopy?</h2>
      <p>Traditional laparoscopy uses 2D cameras, which can limit a surgeon's depth perception. 3D Laparoscopy deploys high-definition 3D camera systems that provide a natural, three-dimensional view of internal organs — remarkably similar to the way we see in everyday life.</p>

      <h2>Benefits of 3D Technology in Surgery</h2>
      <ul>
        <li><strong>Enhanced Precision:</strong> Surgeons can identify tissue layers and blood vessels with far greater clarity, reducing risk.</li>
        <li><strong>Faster Procedures:</strong> Improved depth perception usually leads to shorter operative times.</li>
        <li><strong>Safer Outcomes:</strong> Higher accuracy means a lower risk of complications during and after surgery.</li>
        <li><strong>Quicker Patient Recovery:</strong> Smaller incisions result in less post-operative pain and a faster return to normal activity.</li>
      </ul>

      <h2>Who Benefits Most?</h2>
      <p>3D laparoscopy is suitable for a wide range of procedures including cholecystectomy (gallbladder removal), hernia repair, appendectomy, and various abdominal and pelvic surgeries. Patients who benefit most are those requiring high-precision dissection near critical structures like nerves and blood vessels.</p>

      <h2>Our Commitment</h2>
      <p>Balaji Hospital continually invests in the latest medical technology to ensure patients in Jaipur and surrounding districts receive world-class treatment right here at home. Our surgical team is trained to use 3D systems to their fullest potential, resulting in better, faster outcomes.</p>
    `,
  },
  {
    id: "gynecological-check-ups",
    title: "Why Regular Gynecological Check-ups Are Essential for Women's Health",
    excerpt:
      "Essential health advice for women's wellness and preventive care. Learn what to expect during a check-up and why you should never skip it.",
    author: "Dr. Sheela Agarwal",
    date: "Feb 28, 2024",
    category: "Women's Health",
    image:
      "https://balajihospitaljaipur.com/uploads/blog/1757917461-Why_Regular_Gynecological_Check-ups_Are_Essential_for_Womens_Health-11.jpg",
    content: `
      <p>Women's health is a priority at Balaji Hospital. Regular gynecological check-ups are more than a routine — they are a vital component of preventive healthcare. Many conditions, when detected early, can be managed effectively with minimal intervention, saving patients from more serious health consequences.</p>

      <h2>What to Expect During a Gynecological Check-up</h2>
      <p>A typical visit involves a comprehensive discussion about your health history, a physical examination, and age-appropriate screenings. These may include pelvic exams, Pap smears, breast examinations, hormonal panels, and STI screenings where relevant. The entire process is conducted in a private, comfortable, and respectful environment.</p>

      <h2>Why You Should Never Miss It</h2>
      <p>Preventive care enables early detection of conditions like:</p>
      <ul>
        <li>PCOD/PCOS (Polycystic Ovarian Disease)</li>
        <li>Uterine fibroids or ovarian cysts</li>
        <li>Cervical health concerns and early cervical cancer</li>
        <li>Hormonal imbalances affecting mood, weight, and fertility</li>
        <li>Osteoporosis risk in peri- and post-menopausal women</li>
      </ul>

      <h2>Our Expert Team</h2>
      <p>Our team provides a compassionate and comfortable environment for all patients. We strongly recommend scheduling an annual gynecological check-up starting in your 20s, or earlier if you are sexually active. Call us today at <strong>+91 7276229049</strong> to book your appointment.</p>
    `,
  },
  {
    id: "overweight-and-depression",
    title: "The Link Between Overweight and Depression — What You Should Know",
    excerpt:
      "Exploring the psychosomatic connections between weight management and mental well-being, and what you can do about it.",
    author: "Medical Team",
    date: "Jan 15, 2024",
    category: "General Health",
    image:
      "https://balajihospitaljaipur.com/uploads/blog/1680678123-350x300.jpg",
    content: `
      <p>There is a well-established bidirectional relationship between obesity and depression. People who are overweight are more likely to develop depression, and people who are depressed are more likely to gain weight. Understanding this connection is the first step towards breaking the cycle.</p>

      <h2>The Science Behind the Link</h2>
      <p>Adipose (fat) tissue is not merely an energy store — it is metabolically active and produces inflammatory cytokines that can directly affect brain chemistry. Elevated levels of these inflammatory markers have been consistently associated with depressive symptoms. Additionally, the psychological burden of social stigma around weight can worsen self-esteem and trigger or deepen depression.</p>

      <h2>Warning Signs to Watch For</h2>
      <ul>
        <li>Persistent low mood lasting more than two weeks</li>
        <li>Sudden or unexplained weight gain or loss</li>
        <li>Loss of interest in activities previously enjoyed</li>
        <li>Sleep disturbances (too much or too little)</li>
        <li>Fatigue and low energy despite adequate rest</li>
      </ul>

      <h2>A Holistic Approach</h2>
      <p>At Balaji Hospital, we believe in treating the whole person — not just the symptom. Our team can connect patients experiencing these dual challenges with appropriate specialists in nutrition, physical therapy, and psychological wellness. If you or a loved one is struggling, please do not hesitate to reach out. Early intervention makes all the difference.</p>
    `,
  },
  {
    id: "knee-pain-management",
    title: "Managing Knee Pain: When to See a Doctor",
    excerpt:
      "Knee pain affects millions. Learn the difference between normal soreness and warning signs that require specialist consultation.",
    author: "Dr. Ramesh Agarwal",
    date: "Dec 5, 2023",
    category: "Orthopedic Health",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/9016779965blog-img4.jpg",
    content: `
      <p>Knee pain is one of the most common complaints we see at Balaji Hospital. It can affect people of all ages — from young athletes to older adults struggling with arthritis. While mild knee discomfort after physical activity can be normal, persistent or severe knee pain is a signal your body sends that should not be ignored.</p>

      <h2>Common Causes of Knee Pain</h2>
      <ul>
        <li><strong>Osteoarthritis:</strong> Wear-and-tear of cartilage, most common in people over 50.</li>
        <li><strong>Ligament injuries:</strong> ACL, PCL, or MCL tears — common in sports.</li>
        <li><strong>Meniscus tears:</strong> Often caused by a sudden twist or pivot.</li>
        <li><strong>Tendinitis:</strong> Inflammation of the tendons around the knee.</li>
        <li><strong>Bursitis:</strong> Inflammation of the fluid-filled sacs cushioning the knee joint.</li>
      </ul>

      <h2>When to See a Doctor Immediately</h2>
      <p>You should seek medical attention right away if you experience:</p>
      <ul>
        <li>Severe swelling or redness around the joint</li>
        <li>Inability to bear weight on the affected leg</li>
        <li>A popping or crunching sound at the time of injury</li>
        <li>Knee that feels unstable or gives way</li>
        <li>Fever along with knee pain (possible infection)</li>
      </ul>

      <h2>Treatment Options</h2>
      <p>Treatment depends on the underlying cause and severity. Options range from physiotherapy, bracing, and pain management for mild cases, to arthroscopic surgery or total knee replacement for advanced degeneration. Dr. Ramesh Agarwal at Balaji Hospital specialises in the full spectrum of knee treatments and will guide you to the most appropriate, least invasive solution.</p>
    `,
  },
  {
    id: "spine-health-tips",
    title: "5 Daily Habits That Protect Your Spine",
    excerpt:
      "Simple but powerful lifestyle habits that preserve spinal health and prevent back pain — recommended by our senior orthopaedic surgeon.",
    author: "Dr. Ramesh Agarwal",
    date: "Nov 18, 2023",
    category: "Orthopedic Health",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/img3.jpg",
    content: `
      <p>Your spine is the central pillar of your body, supporting your weight and enabling virtually every movement you make. Yet most people take it for granted — until pain strikes. The good news is that simple, consistent daily habits can dramatically reduce your risk of spinal problems.</p>

      <h2>1. Maintain Correct Posture</h2>
      <p>Poor posture is the leading cause of preventable back pain. Whether sitting, standing, or sleeping, keeping your spine in a neutral alignment reduces stress on discs and muscles. When sitting, keep your feet flat on the floor, knees at 90°, and lower back supported.</p>

      <h2>2. Stay Active — Move Every Hour</h2>
      <p>Prolonged sitting compresses spinal discs and weakens the supporting muscles. Set a reminder to stand and walk for 2–3 minutes every hour. Regular low-impact exercise like walking, swimming, or yoga strengthens the core muscles that support the spine.</p>

      <h2>3. Lift Correctly</h2>
      <p>Improper lifting is a major cause of acute back injuries. Always bend at the knees and hips — not the waist — when picking up objects. Hold the load close to your body and avoid twisting your spine while lifting.</p>

      <h2>4. Strengthen Your Core</h2>
      <p>A strong core (abdominal and back muscles) acts like a natural corset for your spine. Planks, bridges, and bird-dog exercises are excellent starting points. Our physiotherapy team can design a personalised programme if you have existing pain.</p>

      <h2>5. Sleep Smart</h2>
      <p>Your mattress matters. A medium-firm mattress generally supports the natural curves of the spine best. Sleep on your side with a pillow between your knees, or on your back with a pillow under your knees to reduce lumbar pressure.</p>

      <p>If you are already experiencing back pain, don't self-medicate — consult Dr. Ramesh Agarwal at Balaji Hospital for a proper diagnosis and treatment plan.</p>
    `,
  },
];

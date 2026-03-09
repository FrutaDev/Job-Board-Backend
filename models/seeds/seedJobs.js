const Job = require("../jobModel");

exports.seedJobs = async () => {
    try {
        const count = await Job.count();

        if (count <= 2) {
            await Job.bulkCreate([
                {
                    title: "Junior Software Developer",
                    companyId: 1,
                    location: "Chihuahua, Chih.",
                    salary_min: 12000,
                    salary_max: 18000,
                    modalityId: 1,
                    typeOfJobId: 1,

                    description_html: "<p>We are looking for a <strong>Junior Software Developer</strong> to join our engineering team and help build internal tools and APIs.</p>",
                    responsabilities_html: "<ul><li><p>Develop backend services</p></li><li><p>Fix bugs and improve performance</p></li><li><p>Collaborate with the frontend team</p></li></ul>",
                    requirements_html: "<ul><li><p>Knowledge of JavaScript</p></li><li><p>Basic understanding of SQL</p></li><li><p>Familiarity with Git</p></li></ul>",
                    benefits_html: "<ul><li><p>Flexible schedule</p></li><li><p>Learning opportunities</p></li><li><p>Health insurance</p></li></ul>",

                    description_text: "We are looking for a Junior Software Developer to help build internal tools and APIs.",
                    responsabilities_text: "Develop backend services, fix bugs, collaborate with frontend team.",
                    requirements_text: "JavaScript knowledge, SQL basics, Git familiarity.",
                    benefits_text: "Flexible schedule, learning opportunities, health insurance.",

                    isApproved: "approved",
                    isActive: true,
                    userId: 2,

                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    title: "IT Support Intern",
                    companyId: 2,
                    location: "Delicias, Chih.",
                    salary_min: 0,
                    salary_max: 0,
                    modalityId: 1,
                    typeOfJobId: 2,

                    description_html: "<p>The IT department is looking for a student interested in <strong>technical support and hardware maintenance</strong>.</p>",
                    responsabilities_html: "<ul><li><p>Install software</p></li><li><p>Maintain hardware equipment</p></li><li><p>Assist users with technical issues</p></li></ul>",
                    requirements_html: "<ul><li><p>Currently studying Systems Engineering or related</p></li><li><p>Basic networking knowledge</p></li></ul>",
                    benefits_html: "<ul><li><p>Service hours release</p></li><li><p>Professional experience</p></li></ul>",

                    description_text: "IT department looking for student interested in technical support and hardware maintenance.",
                    responsabilities_text: "Install software, maintain hardware, assist users.",
                    requirements_text: "Systems engineering student, networking basics.",
                    benefits_text: "Service hours release and professional experience.",

                    isApproved: "approved",
                    isActive: true,
                    userId: 2,

                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    title: "Frontend React Developer",
                    companyId: 3,
                    location: "Remote",
                    salary_min: 20000,
                    salary_max: 35000,
                    modalityId: 2,
                    typeOfJobId: 1,

                    description_html: "<p>We are searching for a <strong>React Developer</strong> to build modern interfaces for our SaaS platform.</p>",
                    responsabilities_html: "<ul><li><p>Build reusable components</p></li><li><p>Consume REST APIs</p></li><li><p>Improve UI/UX performance</p></li></ul>",
                    requirements_html: "<ul><li><p>Experience with React</p></li><li><p>Understanding of TypeScript</p></li><li><p>Knowledge of REST APIs</p></li></ul>",
                    benefits_html: "<ul><li><p>Remote work</p></li><li><p>Paid vacation</p></li><li><p>Annual bonus</p></li></ul>",

                    description_text: "React developer needed to build modern SaaS interfaces.",
                    responsabilities_text: "Build components, consume APIs, improve UI performance.",
                    requirements_text: "React experience, TypeScript, REST APIs.",
                    benefits_text: "Remote work, paid vacation, annual bonus.",

                    isApproved: "pending",
                    isActive: true,
                    userId: 2,

                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            console.log('Jobs creados correctamente');
        }
    } catch (error) {
        console.error('Error al crear jobs:', error);
    }
};
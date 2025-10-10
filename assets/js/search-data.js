// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "post-variational-message-passing",
        
          title: "Variational Message Passing",
        
        description: "Derivation and algorithmic structure of variational message passing for conjugate exponential-family models.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/variational-message-passing/";
          
        },
      },{id: "post-kullback-leibler-divergence",
        
          title: "Kullback-Leibler Divergence",
        
        description: "Notes on the KL divergence, its connection to the ELBO, and the supporting role of Jensen&#39;s inequality.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/kullback-leibler-divergence/";
          
        },
      },{id: "post-variational-bayes",
        
          title: "Variational Bayes",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/variational-bayes/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-joint-modelling-time-to-event-and-longitudinal-data",
          title: 'Joint Modelling Time to Event and Longitudinal data',
          description: "Statistical methods for analyzing correlated time-to-event and longitudinal outcomes",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_joint_modelling/";
            },},{id: "projects-variational-bayesian-methods-in-clinical-trials",
          title: 'Variational Bayesian methods in Clinical Trials',
          description: "Modern Bayesian computational methods for clinical trial design and analysis",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_variational_bayes_trials/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },];

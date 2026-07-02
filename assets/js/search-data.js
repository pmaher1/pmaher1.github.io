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
        },{id: "post-wip",
        
          title: "WIP",
        
        description: "WIP",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/wip/";
          
        },
      },{id: "post-dose-finding-hierarchical-emax",
        
          title: "Dose Finding Hierarchical Emax",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/dose-finding-hierarchical-emax/";
          
        },
      },{id: "post-frequentist-models-for-non-informative-bayesian-designs",
        
          title: "Frequentist models for non-informative Bayesian designs",
        
        description: "WIP",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/frequentist-models-non-informative-bayesian/";
          
        },
      },{id: "post-gaussian-processes-for-semiparametric-accelerated-failure-time-joint-modelling",
        
          title: "Gaussian Processes for semiparametric accelerated-failure time joint modelling",
        
        description: "WIP",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/gaussian-processes-semiparametric-aft-joint-modelling/";
          
        },
      },{id: "post-quick-estimates-in-missing-data-structures",
        
          title: "Quick Estimates in Missing Data Structures",
        
        description: "WIP",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/quick-estimates-missing-data/";
          
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%70.%6D%61%68%65%72@%75%71.%65%64%75.%61%75", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/patrick-maher-4679a7218", "_blank");
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
      },];

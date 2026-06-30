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
        },{id: "nav-cv",
          title: "cv",
          description: "Curriculum Vitae",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
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

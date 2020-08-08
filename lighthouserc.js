module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/about/',
        'http://localhost:8080/2018/10/21/',
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
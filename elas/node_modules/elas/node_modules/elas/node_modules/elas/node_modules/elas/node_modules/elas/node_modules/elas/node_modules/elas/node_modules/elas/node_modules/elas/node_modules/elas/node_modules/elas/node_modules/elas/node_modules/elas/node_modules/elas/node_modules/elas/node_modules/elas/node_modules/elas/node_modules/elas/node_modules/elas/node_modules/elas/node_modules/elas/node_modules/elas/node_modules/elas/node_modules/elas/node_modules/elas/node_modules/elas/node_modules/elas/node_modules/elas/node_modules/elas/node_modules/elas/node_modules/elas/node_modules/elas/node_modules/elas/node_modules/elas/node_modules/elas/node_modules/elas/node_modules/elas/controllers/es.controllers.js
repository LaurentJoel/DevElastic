const { Client } = require('@elastic/elasticsearch-serverless');

const esClient = new Client({
  node: 'http://192.168.137.94:9200/',
});

exports.search = async (req, res) => {
  try {
    const { index, body } = req.body;
    const response = await esClient.search({
      index,
      query: {
        match: {
          content: body,
        },
      },
    });
    if (response.hits.total.value === 0) {
      console.log('this index not yet exist');
    } else {
      console.log('je t\'ai trouvééééé');
    }
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche' });
  }
};

exports.index = async (req, res) => {
  try {
    const { index, id, body } = req.body;
    const response = await esClient.index({
      index,
      id,
      body: {
        query: {
          match: {
            _all: body,
          },
        },
      },
    });
    console.log('eeee');
    res.json(response.body);
  } catch (error) {
    console.error(error);
    res.status(406).json({ error: 'Une erreur est survenue lors de l\'indexation' });
  }
};


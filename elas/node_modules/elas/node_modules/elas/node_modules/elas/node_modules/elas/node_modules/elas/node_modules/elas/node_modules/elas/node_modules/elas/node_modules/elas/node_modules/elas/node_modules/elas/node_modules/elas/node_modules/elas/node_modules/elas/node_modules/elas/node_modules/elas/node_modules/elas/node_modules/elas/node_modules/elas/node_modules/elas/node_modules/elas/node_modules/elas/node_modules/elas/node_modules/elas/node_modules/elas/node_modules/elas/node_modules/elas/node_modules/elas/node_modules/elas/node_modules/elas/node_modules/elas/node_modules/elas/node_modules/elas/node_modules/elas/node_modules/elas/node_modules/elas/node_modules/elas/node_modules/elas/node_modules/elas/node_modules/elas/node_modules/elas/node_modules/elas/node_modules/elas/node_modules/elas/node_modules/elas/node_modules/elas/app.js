const express = require('express');
const cors = require('cors');
const { htmlToText } = require('html-to-text');

const { Client } = require('@elastic/elasticsearch-serverless');
//const hljs = require('highlight.js');
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Remplacer par l'URL de votre frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// Créer un client Elasticsearch
/*const esClient = new Client({
  node: 'https://e81f3fe075f24e0a86ee497724af2226.es.us-west-2.aws.elastic.cloud:443',
  auth: {
    username: 'elviram elvira',
    password: 'elvirambrenda12',
    apiKey: 'aTlKV1NKRUJsaVRBcEJOUTBDNng6d0M4NXpyQnJSZS1pRmNBNXdZNXk0QQ=='
  }
});*/
// Créer un client Elasticsearch
const esClient = new Client({
  node: 'https://a4ff63d1338c4462971467a4717c1146.us-central1.gcp.cloud.es.io:443',
  auth: {
    username: 'Laurent Mkounga',
    password: 'mkoungalaurentjoel11',
    apiKey: 'd1hSSmdKRUJKdFVoUlNFT2oxYWM6QWtTZU5VSjRROUNRMmk5S2hsQndSUQ=='
  }
});
/*const esClient = new Client({
  node: 'http://192.168.50.180:9200/',
 
});
*/
// ________________________ le le Endpoint pour interroger Elasticsearch____________________________
app.get('/search/:body', async (req, res) => {
  try {
   
    const response = await esClient.search({
      index:"test",
      
        query: {
          match: {
          content: "e"
          }
        
      },
    });
    if (response.hits.total.value==0){
        console.log ("this index not yet exist");
    }
    else{
        console.log ("je t'ai trouvééééé");
        console.log("hum maitenant affiche alors")
    }

   console.log(response) 
    res.json(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche' });
  }
});

// _________________le endpoint pour insérer un document ou un truc  dans Elasticsearch_____________________________
app.post('/index', async (req, res) => {
  try {
   
    const { index, id,body} = req.body;

    const response = await esClient.index({
      index,
      id,
      body: {
        query: {
          match: {
            _all: body
          }
        }
      },
      
    
    
    });
    console.log("eeee");
    res.json(response.body);
   
  } catch (error) {
    console.error(error);
    res.status(406).json({ error: 'Une erreur est survenue lors de l\'indexation poutrtant jai mis sous format JSON' });
  }
});

// les fonctions de recherche  index et document 

//________________recherche d'un index qui donne quand elle veut_______________________________________
app.get('/searchss/:index', async (req, res) => {
    try {
      const { index, body } = req.body;
  
      const response = await esClient.search({
        index,
        
          query: {
            match: {
              author: body
            }
          
        }
      });
  console.log(response)
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la recherche' });
    }
  });

  // __________________fonctions de recherche d'un index____________________________________
  app.get('/index/:index', async (req, res) => {
    try {
      const { index } = req.params;
  
      const response = await esClient.indices.exists({
        index
      });
  
      res.json(response);
      console.log(response)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de l\'index' });
    }
  });

  //_____________________fonctions de suppression _________________________________________

  //foncton de suppression d'un document
  app.delete('/index/:index/:id', async (req, res) => {
    try {
      const { index, id } = req.params;
  
      const response = await esClient.delete({
        index,
        id
      });
  
      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du document' });
    }
  });
  //fonction de suppression d'un index
  app.delete('/index/:index', async (req, res) => {
    try {
      const { index } = req.params;
  
      const response = await esClient.indices.delete({
        index
      });
  
      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'index' });
    }
  });
  app.post('/index/:index', async (req, res) => {
    try {
      const { index } = req.params;
      const { id, body } = req.body;
  
      const response = await esClient.index({
        index,
        id,
        body
      });
  
      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout du document' });
    }
  });



  app.post('/index', async (req, res) => {
    try {
      const { index } = req.body;
  
      const response = await esClient.indices.create({
        index
      });
  
      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'index' });
    }
  });


  //_____________________fonction de mise à jour(update index and document soit le nom)_____________________________


  app.put('/index/:index/:id', async (req, res) => {
    try {
      const { index, id, body } = req.body;
  
      const response = await esClient.update({
        index,
        id,
        body: {
          doc: body
        }
      });
  
      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du document' });
    }
  });


  
app.listen(31100, () => {
  console.log('Serveur API démarré sur le port 308800');
});
app.get('/SearchHighligth', async (req, res) => {
  try {
    const { index, body } = req.body;
    console.log("lajjjjjjjjjj",req);

    const response = await esClient.search({
      index,
      body: {
        query: {
          match: {
            content: body
          }
        },
        highlight: {
          fields: {
            content: {}
          }
        }
      }
    });

    if (response.hits.total.value === 0) {
      console.log("Aucun résultat trouvé");
    } else {
      const results = response.hits.hits.map(hit => {
        const highlightedContent = hit.highlight.content
          ? hit.highlight.content.map(section => {
              // Apply syntax highlighting and then strip HTML tags
              const highlighted = hljs.highlight('html', section).value;
              return stripHtmlTags(highlighted);
            })
          : stripHtmlTags(hit._source.content);  // Also strip HTML tags from original content
    
        return {
          _id: hit._id,
          highlightedContent
        };
      });
      res.json(results);
    }    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherbbbbbbbbbbbbbbbche' });

  }
});

app.get('/search1Highligth/:searchTerm', async (req, res) => {
  
  try {
  //  const { body } = req.body;
  const searchTerm = req.params.searchTerm;

    const response = await esClient.search({
      index:"test",
      body: {
        query: {
          match: {
            content:searchTerm
          }
        },
        highlight: {
          fields: {
            content: {
              pre_tags: ['<strong style="font-weight:bold;color:black;">'],
              post_tags: ['</strong>']
            }
          }
        }
      }
    });
    console.log('Paramètres reçus:', req.query);

    if (response.hits.total.value === 0) {
      console.log("This body does not yet exist");
    } else {
      console.log("Je t'ai trouvééééé");
    }

    console.log(response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche' });
    console.log('Paramètres reçus:', req.query);

  }
});


//rechercher dans un document
app.get('/highlight/:documentId/:searchTerm', async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const searchTerm = req.params.searchTerm;

    const response = await esClient.get({
      index: "test",
      id: documentId
    });

    const highlightedText = response._source.content.replace(new RegExp(searchTerm, 'gi'), match => `<span style="background-color: yellow">${match}</span>`);

    res.send(`<div style="background-color: lightgrey; padding: 10px;">${highlightedText}</div>`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche' });
  }
});
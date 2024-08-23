// ignore_for_file: avoid_print, use_super_parameters

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_application_2_final/documentDetailPage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(const SearchBarApp());

class SearchBarApp extends StatefulWidget {
  const SearchBarApp({Key? key}) : super(key: key);

  @override
  State<SearchBarApp> createState() => _SearchBarAppState();
}

class _SearchBarAppState extends State<SearchBarApp> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> searchResults = [];
  bool isDarkMode = false;

  Future<void> search(String query) async {
    final url = Uri.parse('http://localhost:31100/search1Highligth/$query');

    try {
      final client = http.Client();
      final response = await client.get(url).timeout(const Duration(seconds: 10), onTimeout: () {
        client.close();
        throw Exception('Timeout lors de la requête');
      });

      if (response.statusCode == 200) {
        try {
          Map<String, dynamic> data = json.decode(response.body);
          List<Map<String, dynamic>> results = List<Map<String, dynamic>>.from(data['hits']['hits'].map((item) => {
            '_id': item['_id'],
            
            'section': item['highlight']['content'][0],
          }));
          print (results);

          setState(() {
            searchResults = results;
          });
        } catch (e) {
          print('Erreur de décodage JSON : $e');
        }
      } else {
        print('Erreur de recherche: ${response.statusCode} - ${response.body}');
      }
    } catch (e, stackTrace) {
      if (e is TimeoutException) {
        print('Erreur : Délai de requête dépassé');
      } else {
        print('Erreur lors de la requête : $e');
        print("Erreur lors de la requête : ${e.toString()}");
        print("Erreur lors de la requête : $stackTrace");
      }
    } finally {
      
    }
  }

  TextSpan highlightText(String text) {
    List<TextSpan> spans = [];
    RegExp exp = RegExp(r'<strong.*?>(.*?)<\/strong>', caseSensitive: false);
    int lastMatchEnd = 0;

    for (var match in exp.allMatches(text)) {
      if (match.start > lastMatchEnd) {
        spans.add(TextSpan(text: text.substring(lastMatchEnd, match.start)));
      }
      spans.add(TextSpan(
        text: match.group(1),
        style: const TextStyle(color: Colors.yellow, fontWeight: FontWeight.bold),
      ));
      lastMatchEnd = match.end;
    }

    if (lastMatchEnd < text.length) {
      spans.add(TextSpan(text: text.substring(lastMatchEnd)));
    }

    return TextSpan(children: spans);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Search Bar App',
      theme: isDarkMode ? ThemeData.dark() : ThemeData.light(),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Résultats de recherche'),
          backgroundColor: Colors.blue,
          actions: [
            IconButton(
              icon: const Icon(Icons.lightbulb),
              onPressed: () {
                setState(() {
                  isDarkMode = !isDarkMode;
                });
              },
            ),
          ],
        ),
        body: Center(
          child: Container(
            width: 400,
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Recherche...',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20.0)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 20.0),
                        ),
                        onChanged: (value) {
                          search(value);
                        },
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.search),
                      onPressed: () {
                        search(_searchController.text);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: ListView.builder(
                    itemCount: searchResults.length,
                    itemBuilder: (context, index) {
                      Map<String, dynamic> result = searchResults[index];
                      String section = result['section'] as String;

                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 5.0),
                        child: ListTile(
                          title: RichText(
                            text: highlightText(section),
                          ),
                          onTap: () {
                          
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => DocumentDetailPage(
        documentId: result['_id'], 
        searchTerm: _searchController.text,
      ),
    ),
  );


                            // Action à effectuer lorsqu'un résultat est sélectionné mais on vera aprés je refléchi encore bon je vient s 
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        bottomNavigationBar: BottomNavigationBar(
          backgroundColor: Colors.blue,
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Accueil',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.book),
              label: 'Favoris',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: 'Paramètres',
            ),
          ],
        ),
      ),
    );
  }
}

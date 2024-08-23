// ignore_for_file: library_private_types_in_public_api, use_super_parameters, file_names

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DocumentDetailPage extends StatefulWidget {
  final String documentId;
  final String searchTerm;

  const DocumentDetailPage({Key? key, required this.documentId, required this.searchTerm}) : super(key: key);

  @override
  _DocumentDetailPageState createState() => _DocumentDetailPageState();
}

class _DocumentDetailPageState extends State<DocumentDetailPage> {
  String? highlightedContent;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchDocument();
  }

  Future<void> fetchDocument() async {
    final url = Uri.parse('http://localhost:31100/highlight/${widget.documentId}/${widget.searchTerm}');
    
    try {
      final response = await http.get(url);
      
      if (response.statusCode == 200) {
        setState(() {
          highlightedContent = response.body;
          isLoading = false;
        });
      } else {
        setState(() {
          highlightedContent = 'Erreur lors du chargement du document.';
          isLoading = false;
        });
      }
    } catch (error) {
      setState(() {
        highlightedContent = 'Erreur lors du chargement du document: $error';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Détail du Document'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: SingleChildScrollView(
                child: Container(
                  color: Colors.grey[200],
                  padding: const EdgeInsets.all(10.0),
                  child: highlightedContent != null
                      ? _buildHighlightedText(highlightedContent!, widget.searchTerm)
                      : const Text('Aucun contenu à afficher'),
                ),
              ),
            ),
    );
  }

  Widget _buildHighlightedText(String content, String searchTerm) {
    
    List<TextSpan> spans = [];
    int start = 0;
    int index;

    while ((index = content.toLowerCase().indexOf(searchTerm.toLowerCase(), start)) != -1) {
      if (index > start) {
        spans.add(TextSpan(text: content.substring(start, index)));
      }
      spans.add(TextSpan(
        text: content.substring(index, index + searchTerm.length),
        style: const TextStyle(backgroundColor: Colors.yellow),
      ));
      start = index + searchTerm.length;
    }

    if (start < content.length) {
      spans.add(TextSpan(text: content.substring(start)));
    }

    return Text.rich(TextSpan(children: spans));
  }
}

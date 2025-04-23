import React, { useState } from 'react';
import { FlatList, View, Text, Button } from 'react-native';

const itemsPerPage = 5;

const MyFlatList = () => {
  const data = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <View>
      <FlatList
        data={currentItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="Previous" onPress={() => setCurrentPage(p => Math.max(1, p - 1))} />
        <Text>{`${currentPage} / ${totalPages}`}</Text>
        <Button title="Next" onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
      </View>
    </View>
  );
};

export default MyFlatList;

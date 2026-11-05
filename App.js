import * as React from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const COURSES = ['Starter', 'Main Course', 'Dessert'];
const VAT_RATE = 0.15;

const INITIAL_ITEMS = [
  {
    id: '1',
    dishName: 'Mussels',
    description: 'Steamed and dipped in garlic sauce with white wine',
    course: 'Starter',
    price: 95,
  },
  {
    id: '2',
    dishName: 'Grilled Chicken',
    description: 'Served with veggies and starch of your choice',
    course: 'Main Course',
    price: 185,
  },
  {
    id: '3',
    dishName: 'Chocolate Cake',
    description: 'Rich and moist',
    course: 'Dessert',
    price: 105,
  },
];

function Button({ title, accessibilityLabel, onPress, kind = 'primary', style }) {
  const buttonVariant =
    kind === 'secondary'
      ? styles.secondaryButton
      : kind === 'outline'
        ? styles.outlineButton
        : kind === 'danger'
          ? styles.dangerButton
          : styles.primaryButton;
  const textVariant =
    kind === 'secondary'
      ? styles.secondaryButtonText
      : kind === 'outline'
        ? styles.outlineButtonText
        : kind === 'danger'
          ? styles.dangerButtonText
          : styles.primaryButtonText;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      hitSlop={6}
      activeOpacity={0.84}
      onPress={onPress}
      style={[styles.button, buttonVariant, style]}
    >
      <Text style={[styles.buttonText, textVariant]}>{title}</Text>
    </TouchableOpacity>
  );
}

function FoodHero() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&crop=entropy&w=1200&h=750&q=85',
      }}
      style={styles.foodHero}
      imageStyle={styles.foodHeroImage}
      resizeMode="cover"
      accessible
      accessibilityRole="image"
      accessibilityLabel="A plate of freshly prepared shrimp with lemon"
    >
      <View style={styles.foodHeroContent}>
        <Text style={styles.foodHeroBrand}>FAHRENHEIT</Text>
        <Text style={styles.foodHeroCaption}>GOOD FOOD. GREAT MOMENTS.</Text>
      </View>
      <View style={styles.plateBadge}>
        <Text style={styles.plateBadgeText}>FRESHLY PREPARED</Text>
      </View>
    </ImageBackground>
  );
}

function HomeScreen({ navigation, menuItems }) {
  return (
    <SafeAreaView style={styles.home}>
      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcome}>
          <Text style={styles.eyebrow}>WELCOME TO</Text>
          <Text style={styles.homeTitle}>A menu worth{"\n"}coming back to.</Text>
          <Text style={styles.description}>
            Shape your menu, discover every dish, and keep an eye on the details.
          </Text>
        </View>
        <FoodHero />
        <View style={styles.homeSummary}>
          <View style={styles.statusDot} />
          <Text style={styles.summaryText}>
            {menuItems.length} {menuItems.length === 1 ? 'dish' : 'dishes'} on today's menu
          </Text>
        </View>
        <View style={styles.homeButtons}>
          <Button
            title="Manage your menu"
            onPress={() => navigation.navigate('Manage Items')}
          />
          <Button
            title="Explore dishes"
            kind="secondary"
            onPress={() => navigation.navigate('Menu Items')}
          />
          <Button
            title="View menu insights"
            kind="outline"
            onPress={() => navigation.navigate('Statistics')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItemCard({ item, actions, meta }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle}>{item.dishName}</Text>
          <Text style={styles.courseTag}>{item.course}</Text>
        </View>
        <Text style={styles.price}>R{Number(item.price).toFixed(2)}</Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      {meta ? <Text style={styles.cardMeta}>{meta}</Text> : null}
      {actions ? <View style={styles.cardActions}>{actions}</View> : null}
    </View>
  );
}

function ManageItemsScreen({
  menuItems,
  setMenuItems,
  deletedItems,
  setDeletedItems,
}) {
  const [dishName, setDishName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [course, setCourse] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };

  const saveItem = () => {
    const cleanName = dishName.trim();
    const cleanDescription = description.trim();
    const numericPrice = Number(price.trim());

    if (!cleanName || !cleanDescription || !course || !price.trim()) {
      Alert.alert('Missing information', 'Please complete every field.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Enter a price greater than zero.');
      return;
    }

    if (editingId) {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                dishName: cleanName,
                description: cleanDescription,
                course,
                price: numericPrice,
              }
            : item
        )
      );
      Alert.alert('Item updated', `${cleanName} was updated.`);
    } else {
      setMenuItems((items) => [
        ...items,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          dishName: cleanName,
          description: cleanDescription,
          course,
          price: numericPrice,
        },
      ]);
      Alert.alert('Item added', `${cleanName} was added to the menu.`);
    }
    clearForm();
  };

  const editItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(String(item.price));
    setEditingId(item.id);
  };

  const deleteItem = (item) => {
    Alert.alert('Delete menu item?', `Move ${item.dishName} to Deleted Items?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMenuItems((items) => items.filter((entry) => entry.id !== item.id));
          setDeletedItems((items) => [
            {
              ...item,
              deletedId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              deletedAt: new Date().toISOString(),
            },
            ...items,
          ]);
          if (editingId === item.id) clearForm();
        },
      },
    ]);
  };

  const restoreItem = (deletedItem) => {
    const { deletedId, deletedAt, ...item } = deletedItem;
    setMenuItems((items) => [...items, item]);
    setDeletedItems((items) =>
      items.filter((entry) => entry.deletedId !== deletedItem.deletedId)
    );
    Alert.alert('Item restored', `${item.dishName} is back on the menu.`);
  };

  const removeForever = (deletedItem) => {
    Alert.alert(
      'Permanently remove item?',
      `${deletedItem.dishName} will be removed from the deleted items list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove forever',
          style: 'destructive',
          onPress: () =>
            setDeletedItems((items) =>
              items.filter((entry) => entry.deletedId !== deletedItem.deletedId)
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.pageTitle}>Manage items</Text>
        <Text style={styles.description}>
          Add a dish or select an existing item to edit or delete it.
        </Text>

        <Text style={styles.sectionTitle}>
          {editingId ? 'Edit menu item' : 'Add a menu item'}
        </Text>
        <Text style={styles.label}>Dish name</Text>
        <TextInput
          style={styles.input}
          placeholder="Dish name"
          value={dishName}
          onChangeText={setDishName}
          returnKeyType="next"
          accessibilityLabel="Dish name"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          returnKeyType="next"
          accessibilityLabel="Description"
        />
        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerBox}>
          <Picker
            style={styles.picker}
            selectedValue={course}
            onValueChange={setCourse}
            accessibilityLabel="Choose a course"
          >
            <Picker.Item label="Select course" value="" color="#b7acbd" />
            {COURSES.map((courseName) => (
              <Picker.Item
                key={courseName}
                label={courseName}
                value={courseName}
                color="#fff7eb"
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Price (rand)</Text>
        <TextInput
          style={styles.input}
          placeholder="Price (R)"
          value={price}
          onChangeText={(value) => setPrice(value.replace(',', '.'))}
          keyboardType="decimal-pad"
          returnKeyType="done"
          accessibilityLabel="Price"
        />
        <Text style={styles.fieldHint}>
          Enter the price in rand, for example 95 or 95.50.
        </Text>
        <Button
          title={editingId ? 'Save changes' : 'Add menu item'}
          onPress={saveItem}
        />
        {editingId ? (
          <Button title="Cancel edit" kind="outline" onPress={clearForm} />
        ) : null}

        <Text style={styles.sectionTitle}>Current menu items ({menuItems.length})</Text>
        {menuItems.length === 0 ? (
          <Text style={styles.empty}>No active menu items. Add one above.</Text>
        ) : (
          menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              actions={
                <>
                  <Button
                    title="Edit"
                    accessibilityLabel={`Edit ${item.dishName}`}
                    kind="outline"
                    style={styles.smallButton}
                    onPress={() => editItem(item)}
                  />
                  <Button
                    title="Delete"
                    accessibilityLabel={`Delete ${item.dishName}`}
                    kind="danger"
                    style={styles.smallButton}
                    onPress={() => deleteItem(item)}
                  />
                </>
              }
            />
          ))
        )}
        <Text style={styles.sectionTitle}>Deleted items ({deletedItems.length})</Text>
        <Text style={styles.description}>
          Deleted dishes stay here until you restore or permanently remove them.
        </Text>
        {deletedItems.length === 0 ? (
          <Text style={styles.empty}>Deleted dishes will appear here.</Text>
        ) : (
          deletedItems.map((item) => (
            <MenuItemCard
              key={item.deletedId}
              item={item}
              meta={`Deleted ${new Date(item.deletedAt).toLocaleString()}`}
              actions={
                <>
                  <Button
                    title="Restore"
                    accessibilityLabel={`Restore ${item.dishName}`}
                    kind="secondary"
                    style={styles.smallButton}
                    onPress={() => restoreItem(item)}
                  />
                  <Button
                    title="Remove forever"
                    accessibilityLabel={`Permanently remove ${item.dishName}`}
                    kind="danger"
                    style={styles.smallButton}
                    onPress={() => removeForever(item)}
                  />
                </>
              }
            />
          ))
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MenuItemsScreen({ menuItems }) {
  const [searchText, setSearchText] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('All');

  const visibleItems = menuItems.filter((item) => {
    const matchesName = item.dishName
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    const matchesCourse =
      selectedCourse === 'All' || item.course === selectedCourse;
    return matchesName && matchesCourse;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>Menu items</Text>
            <Text style={styles.description}>
              Search dishes or filter the menu by course.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Search by dish name"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel="Search menu items by name"
            />
            <Text style={styles.label}>Filter by course</Text>
            <View style={styles.pickerBox}>
              <Picker
                style={styles.picker}
                selectedValue={selectedCourse}
                onValueChange={setSelectedCourse}
                accessibilityLabel="Filter menu by course"
              >
                <Picker.Item label="All courses" value="All" color="#fff7eb" />
                {COURSES.map((courseName) => (
                  <Picker.Item
                    key={courseName}
                    label={courseName}
                    value={courseName}
                    color="#fff7eb"
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.filterSummary}>
              <Text style={styles.resultCount}>
                Showing {visibleItems.length} of {menuItems.length} items
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Clear search and course filter"
                hitSlop={8}
                onPress={() => {
                  setSearchText('');
                  setSelectedCourse('All');
                }}
              >
                <Text style={styles.clearText}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <MenuItemCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {menuItems.length === 0
              ? 'Your menu is empty. Add items from Manage Items.'
              : 'No items match your search and course filter.'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

function StatisticsScreen({ menuItems }) {
  const totalPrice = menuItems.reduce((sum, item) => sum + Number(item.price), 0);
  const averagePrice = menuItems.length ? totalPrice / menuItems.length : 0;
  const includedVat = (grossPrice) => (grossPrice * VAT_RATE) / (1 + VAT_RATE);
  const totalVat = includedVat(totalPrice);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Menu statistics</Text>
        <Text style={styles.description}>
          Menu prices are shown with South African VAT (15%) included. VAT is
          already part of the prices, not added on top.
        </Text>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{menuItems.length}</Text>
          <Text style={styles.statCaption}>Total menu items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {menuItems.length ? `R${averagePrice.toFixed(2)}` : 'No meals yet'}
          </Text>
          <Text style={styles.statCaption}>Average meal price (incl. VAT)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>R{totalPrice.toFixed(2)}</Text>
          <Text style={styles.statCaption}>Total menu prices (incl. VAT)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>R{totalVat.toFixed(2)}</Text>
          <Text style={styles.statCaption}>VAT included in total menu prices</Text>
        </View>

        <Text style={styles.sectionTitle}>Statistics by course</Text>
        {COURSES.map((courseName) => {
          const courseItems = menuItems.filter((item) => item.course === courseName);
          const courseTotal = courseItems.reduce(
            (sum, item) => sum + Number(item.price),
            0
          );
          const courseAverage = courseItems.length
            ? courseTotal / courseItems.length
            : 0;
          const courseVat = includedVat(courseTotal);

          return (
            <View key={courseName} style={styles.courseCard}>
              <Text style={styles.courseHeading}>{courseName}</Text>
              <View style={styles.courseMetricRow}>
                <Text style={styles.courseMetricLabel}>Number of meals</Text>
                <Text style={styles.courseMetricValue}>{courseItems.length}</Text>
              </View>
              <View style={styles.courseMetricRow}>
                <Text style={styles.courseMetricLabel}>Average price (incl. VAT)</Text>
                <Text style={styles.courseMetricValue}>
                  {courseItems.length ? `R${courseAverage.toFixed(2)}` : 'No meals'}
                </Text>
              </View>
              <View style={styles.courseMetricRow}>
                <Text style={styles.courseMetricLabel}>Course total (incl. VAT)</Text>
                <Text style={styles.courseMetricValue}>
                  R{courseTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.courseMetricRow}>
                <Text style={styles.courseMetricLabel}>VAT included</Text>
                <Text style={styles.courseMetricValue}>
                  R{courseVat.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
        {menuItems.length === 0 ? (
          <Text style={styles.empty}>
            Add menu items to calculate menu statistics.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [menuItems, setMenuItems] = React.useState(INITIAL_ITEMS);
  const [deletedItems, setDeletedItems] = React.useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#201d26' },
          headerTintColor: '#f5ead7',
          headerTitleStyle: { fontWeight: '700' },
          cardStyle: { backgroundColor: '#17151b' },
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="Manage Items">
          {(props) => (
            <ManageItemsScreen
              {...props}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              deletedItems={deletedItems}
              setDeletedItems={setDeletedItems}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Menu Items">
          {(props) => <MenuItemsScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="Statistics">
          {(props) => <StatisticsScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#17151b',
  },
  homeContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
  },
  welcome: {
    paddingTop: 12,
  },
  eyebrow: {
    color: '#edb76b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 12,
  },
  homeTitle: {
    color: '#fff7eb',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  description: {
    color: '#b7acbd',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 14,
  },
  foodHero: {
    height: 220,
    marginTop: 4,
    marginBottom: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#6e5743',
    backgroundColor: '#302934',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 16,
    elevation: 10,
  },
  foodHeroImage: {
    borderRadius: 21,
  },
  foodHeroContent: {
    width: '100%',
    paddingHorizontal: 17,
    paddingBottom: 17,
    paddingTop: 42,
    backgroundColor: 'rgba(20, 17, 22, 0.48)',
  },
  foodHeroBrand: {
    color: '#fff7eb',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  foodHeroCaption: {
    color: '#f3c983',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 5,
  },
  plateBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#302934',
    borderWidth: 1,
    borderColor: '#514354',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
  },
  plateBadgeText: {
    color: '#f3c983',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  homeButtons: {
    gap: 7,
    marginTop: 12,
  },
  homeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: '#24212a',
    borderWidth: 1,
    borderColor: '#37313c',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#91b77b',
  },
  summaryText: {
    color: '#e9dfd0',
    fontWeight: '700',
  },
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#17151b',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  pageTitle: {
    color: '#fff7eb',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#f3c983',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    color: '#e9dfd0',
    fontWeight: '700',
    marginBottom: 6,
  },
  fieldHint: {
    color: '#b7acbd',
    fontSize: 13,
    lineHeight: 18,
    marginTop: -5,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#423b48',
    borderRadius: 10,
    backgroundColor: '#24212a',
    color: '#fff7eb',
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 12,
  },
  multilineInput: {
    minHeight: 75,
    textAlignVertical: 'top',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#423b48',
    borderRadius: 10,
    backgroundColor: '#24212a',
    overflow: 'hidden',
    marginBottom: 12,
  },
  picker: {
    color: '#fff7eb',
  },
  button: {
    minHeight: 49,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderBottomWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#d4954d',
    borderBottomColor: '#8b552f',
  },
  primaryButtonText: {
    color: '#201710',
  },
  secondaryButton: {
    backgroundColor: '#637b59',
    borderBottomColor: '#394934',
  },
  secondaryButtonText: {
    color: '#fff7eb',
  },
  outlineButton: {
    backgroundColor: '#24212a',
    borderWidth: 1,
    borderColor: '#5d4b62',
    borderBottomWidth: 4,
    borderBottomColor: '#372b3c',
  },
  outlineButtonText: {
    color: '#e7c89e',
  },
  dangerButton: {
    backgroundColor: '#4a292b',
    borderBottomColor: '#301b1d',
  },
  dangerButtonText: {
    color: '#ffb8a9',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#24212a',
    borderWidth: 1,
    borderColor: '#3a3440',
    borderBottomWidth: 4,
    borderBottomColor: '#100f13',
    borderRadius: 16,
    padding: 15,
    marginVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff7eb',
    fontSize: 18,
    fontWeight: '800',
  },
  courseTag: {
    color: '#a8c58f',
    fontWeight: '700',
    marginTop: 4,
  },
  price: {
    color: '#f3c983',
    fontWeight: '800',
    fontSize: 16,
  },
  itemDescription: {
    color: '#b7acbd',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },
  cardMeta: {
    color: '#a89aac',
    fontSize: 12,
    marginTop: 7,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  smallButton: {
    minWidth: 82,
    minHeight: 39,
    marginBottom: 0,
  },
  filterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultCount: {
    color: '#b7acbd',
    fontWeight: '600',
  },
  clearText: {
    color: '#f3c983',
    fontWeight: '700',
    paddingVertical: 8,
  },
  empty: {
    color: '#b7acbd',
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: 22,
  },
  statCard: {
    backgroundColor: '#24212a',
    borderWidth: 1,
    borderColor: '#3a3440',
    borderBottomWidth: 4,
    borderBottomColor: '#100f13',
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  statNumber: {
    color: '#f3c983',
    fontSize: 30,
    fontWeight: '800',
  },
  statCaption: {
    color: '#b7acbd',
    fontSize: 14,
    marginTop: 4,
  },
  courseCard: {
    backgroundColor: '#24212a',
    borderWidth: 1,
    borderColor: '#3a3440',
    borderBottomWidth: 4,
    borderBottomColor: '#100f13',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  courseHeading: {
    color: '#f3c983',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  courseMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: '#3a3440',
  },
  courseMetricLabel: {
    color: '#b7acbd',
  },
  courseMetricValue: {
    color: '#d2e0bd',
    fontWeight: '700',
  },
});

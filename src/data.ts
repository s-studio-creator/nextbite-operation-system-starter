import { Companion, Dish, FeedItem, GentleMission, MealLog, Restaurant, ScanResult } from "./types";
import { buildMealLog, createDishSelection } from "./utils/nutrition";

type DistrictSeed = {
  district: string;
  latitude: number;
  longitude: number;
  streets: string[];
};

type RestaurantTheme = {
  cuisine: string;
  nameParts: string[];
  highlights: string[];
  price: string;
  image: string;
  menu: Omit<Dish, "id" | "restaurantId">[];
};

const districtSeeds: DistrictSeed[] = [
  { district: "中環", latitude: 22.2819, longitude: 114.1589, streets: ["德輔道中", "威靈頓街", "皇后大道中"] },
  { district: "上環", latitude: 22.2868, longitude: 114.1499, streets: ["文咸東街", "荷李活道", "干諾道中"] },
  { district: "灣仔", latitude: 22.2774, longitude: 114.1734, streets: ["皇后大道東", "軒尼詩道", "莊士敦道"] },
  { district: "金鐘", latitude: 22.2798, longitude: 114.1657, streets: ["金鐘道", "夏慤道", "添美道"] },
  { district: "銅鑼灣", latitude: 22.2797, longitude: 114.185, streets: ["駱克道", "謝斐道", "希慎道"] },
  { district: "北角", latitude: 22.2913, longitude: 114.2007, streets: ["英皇道", "和富道", "電氣道"] },
  { district: "太古", latitude: 22.2865, longitude: 114.2167, streets: ["太古城道", "英皇道", "康山道"] },
  { district: "尖沙咀", latitude: 22.2993, longitude: 114.1722, streets: ["加拿分道", "廣東道", "漆咸道南"] },
  { district: "佐敦", latitude: 22.3048, longitude: 114.1716, streets: ["彌敦道", "吳松街", "白加士街"] },
  { district: "旺角", latitude: 22.3186, longitude: 114.1694, streets: ["彌敦道", "花園街", "登打士街"] },
  { district: "太子", latitude: 22.3244, longitude: 114.1688, streets: ["太子道西", "砵蘭街", "界限街"] },
  { district: "深水埗", latitude: 22.3308, longitude: 114.1622, streets: ["福華街", "長沙灣道", "汝州街"] },
  { district: "九龍灣", latitude: 22.323, longitude: 114.213, streets: ["宏照道", "啟祥道", "常悅道"] },
  { district: "觀塘", latitude: 22.3122, longitude: 114.2259, streets: ["成業街", "開源道", "巧明街"] },
  { district: "荃灣", latitude: 22.3707, longitude: 114.1095, streets: ["青山公路", "眾安街", "大河道"] },
  { district: "沙田", latitude: 22.3829, longitude: 114.1915, streets: ["沙田正街", "源禾路", "大涌橋路"] },
  { district: "元朗", latitude: 22.4445, longitude: 114.0222, streets: ["青山公路元朗段", "教育路", "鳳翔路"] },
  { district: "屯門", latitude: 22.3916, longitude: 113.9766, streets: ["屯門鄉事會路", "杯渡路", "青山公路"] },
  { district: "將軍澳", latitude: 22.308, longitude: 114.2608, streets: ["唐德街", "重華路", "寶邑路"] },
  { district: "堅尼地城", latitude: 22.2812, longitude: 114.1287, streets: ["卑路乍街", "吉席街", "士美菲路"] }
];

const dishImages = {
  bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
  noodle: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900",
  grill: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900",
  veggie: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900",
  cafe: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900",
  soup: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
  drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900",
  dessert: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900"
};

const restaurantThemes: RestaurantTheme[] = [
  {
    cuisine: "健康碗",
    nameParts: ["輕盈碗", "藜麥日常", "柔光沙律", "均衡飯堂"],
    highlights: ["高蛋白", "低油", "可走醬", "份量清楚"],
    price: "$$",
    image: dishImages.bowl,
    menu: [
      { name: "三文魚藜麥碗", category: "food", image: dishImages.bowl, calories: 520, protein: 34, carbs: 48, fat: 19, tags: ["人氣健康選", "高蛋白"] },
      { name: "香草雞胸糙米碗", category: "food", image: dishImages.bowl, calories: 460, protein: 38, carbs: 42, fat: 12, tags: ["減脂推薦", "低油"] },
      { name: "照燒豆腐蔬菜碗", category: "food", image: dishImages.veggie, calories: 410, protein: 22, carbs: 50, fat: 11, tags: ["素食", "低卡"] },
      { name: "溫泉蛋羽衣甘藍配菜", category: "side", image: dishImages.veggie, calories: 180, protein: 12, carbs: 10, fat: 9, tags: ["加蛋白", "清爽"] },
      { name: "無糖檸檬冷泡茶", category: "drink", image: dishImages.drink, calories: 35, protein: 0, carbs: 8, fat: 0, tags: ["低糖", "飲品"] },
      { name: "希臘乳酪莓果杯", category: "dessert", image: dishImages.dessert, calories: 210, protein: 12, carbs: 24, fat: 7, tags: ["甜品", "高蛋白"] }
    ]
  },
  {
    cuisine: "粉麵",
    nameParts: ["清湯粉麵", "米線研究所", "暖湯小館", "清爽麵屋"],
    highlights: ["清湯底", "可走油", "少鹽選項", "暖胃"],
    price: "$",
    image: dishImages.noodle,
    menu: [
      { name: "清湯牛肉米粉", category: "food", image: dishImages.noodle, calories: 430, protein: 29, carbs: 56, fat: 8, tags: ["低脂", "清湯"] },
      { name: "魚片米線走油", category: "food", image: dishImages.noodle, calories: 390, protein: 28, carbs: 54, fat: 6, tags: ["少油", "高蛋白"] },
      { name: "雜菜米線", category: "food", image: dishImages.noodle, calories: 360, protein: 12, carbs: 64, fat: 5, tags: ["低卡", "高纖"] },
      { name: "灼菜加雞蛋", category: "side", image: dishImages.veggie, calories: 160, protein: 11, carbs: 12, fat: 7, tags: ["配菜", "均衡"] },
      { name: "熱薑茶少糖", category: "drink", image: dishImages.drink, calories: 55, protein: 0, carbs: 13, fat: 0, tags: ["暖飲", "少糖"] },
      { name: "豆腐花少糖", category: "dessert", image: dishImages.dessert, calories: 170, protein: 8, carbs: 26, fat: 4, tags: ["甜品", "輕盈"] }
    ]
  },
  {
    cuisine: "扒房",
    nameParts: ["炭燒蛋白館", "穩定扒房", "健身餐桌", "烤焗日常"],
    highlights: ["高蛋白", "醬汁分開", "健身餐", "可選烤菜"],
    price: "$$$",
    image: dishImages.grill,
    menu: [
      { name: "西冷扒配烤菜", category: "food", image: dishImages.grill, calories: 610, protein: 47, carbs: 28, fat: 34, tags: ["高蛋白"] },
      { name: "香烤鱈魚配薯蓉", category: "food", image: dishImages.grill, calories: 540, protein: 42, carbs: 39, fat: 20, tags: ["均衡"] },
      { name: "烤雞凱撒走醬", category: "food", image: dishImages.grill, calories: 450, protein: 36, carbs: 20, fat: 23, tags: ["可控卡", "高蛋白"] },
      { name: "烤南瓜菠菜", category: "side", image: dishImages.veggie, calories: 150, protein: 5, carbs: 24, fat: 4, tags: ["配菜", "高纖"] },
      { name: "青檸梳打水", category: "drink", image: dishImages.drink, calories: 20, protein: 0, carbs: 5, fat: 0, tags: ["飲品", "低糖"] },
      { name: "莓果乳清布甸", category: "dessert", image: dishImages.dessert, calories: 240, protein: 18, carbs: 22, fat: 8, tags: ["甜品", "蛋白質"] }
    ]
  },
  {
    cuisine: "素食",
    nameParts: ["素研所", "植物日常", "綠意小桌", "蔬食光舍"],
    highlights: ["高纖", "少油", "素食友善", "蔬菜充足"],
    price: "$$",
    image: dishImages.veggie,
    menu: [
      { name: "野菌糙米飯", category: "food", image: dishImages.veggie, calories: 470, protein: 16, carbs: 72, fat: 12, tags: ["高纖", "素食"] },
      { name: "扁豆南瓜湯餐", category: "food", image: dishImages.soup, calories: 380, protein: 20, carbs: 52, fat: 8, tags: ["飽足", "低卡"] },
      { name: "牛油果蔬菜卷", category: "food", image: dishImages.veggie, calories: 420, protein: 13, carbs: 48, fat: 18, tags: ["輕盈", "素食"] },
      { name: "鷹嘴豆小碟", category: "side", image: dishImages.veggie, calories: 190, protein: 9, carbs: 22, fat: 7, tags: ["配菜", "植物蛋白"] },
      { name: "薄荷青瓜水", category: "drink", image: dishImages.drink, calories: 25, protein: 0, carbs: 6, fat: 0, tags: ["飲品", "清爽"] },
      { name: "椰子奇亞籽杯", category: "dessert", image: dishImages.dessert, calories: 260, protein: 8, carbs: 24, fat: 14, tags: ["甜品", "高纖"] }
    ]
  },
  {
    cuisine: "咖啡輕食",
    nameParts: ["晨光咖啡", "暖木輕食", "雲朵咖啡室", "柔和早午餐"],
    highlights: ["早午餐", "少糖飲品", "高蛋白輕食", "舒適環境"],
    price: "$$",
    image: dishImages.cafe,
    menu: [
      { name: "煙三文魚牛油果多士", category: "food", image: dishImages.cafe, calories: 480, protein: 27, carbs: 38, fat: 24, tags: ["早午餐", "均衡"] },
      { name: "雞蛋希臘乳酪碗", category: "food", image: dishImages.bowl, calories: 420, protein: 32, carbs: 36, fat: 13, tags: ["高蛋白", "輕盈"] },
      { name: "番茄羅勒雞肉卷", category: "food", image: dishImages.cafe, calories: 450, protein: 35, carbs: 42, fat: 12, tags: ["高蛋白", "低油"] },
      { name: "烤菇菠菜小碟", category: "side", image: dishImages.veggie, calories: 130, protein: 6, carbs: 12, fat: 6, tags: ["配菜", "蔬菜"] },
      { name: "燕麥奶拿鐵少糖", category: "drink", image: dishImages.drink, calories: 120, protein: 3, carbs: 16, fat: 5, tags: ["飲品", "少糖"] },
      { name: "香蕉燕麥鬆餅", category: "dessert", image: dishImages.dessert, calories: 280, protein: 8, carbs: 42, fat: 9, tags: ["甜品", "燕麥"] }
    ]
  },
  {
    cuisine: "日式定食",
    nameParts: ["和風定食", "暖飯小舍", "清爽食堂", "味噌日常"],
    highlights: ["定食份量", "烤物為主", "湯品選項", "可少飯"],
    price: "$$",
    image: dishImages.soup,
    menu: [
      { name: "鹽燒鯖魚定食少飯", category: "food", image: dishImages.grill, calories: 560, protein: 36, carbs: 52, fat: 22, tags: ["高蛋白", "可少飯"] },
      { name: "雞肉豆腐漢堡定食", category: "food", image: dishImages.grill, calories: 500, protein: 34, carbs: 48, fat: 17, tags: ["均衡", "低油"] },
      { name: "味噌蔬菜湯飯", category: "food", image: dishImages.soup, calories: 390, protein: 18, carbs: 58, fat: 8, tags: ["暖胃", "低卡"] },
      { name: "冷豆腐海藻小碟", category: "side", image: dishImages.veggie, calories: 120, protein: 10, carbs: 8, fat: 5, tags: ["配菜", "清爽"] },
      { name: "無糖玄米茶", category: "drink", image: dishImages.drink, calories: 5, protein: 0, carbs: 1, fat: 0, tags: ["飲品", "無糖"] },
      { name: "抹茶豆乳布甸", category: "dessert", image: dishImages.dessert, calories: 220, protein: 9, carbs: 28, fat: 7, tags: ["甜品", "豆乳"] }
    ]
  }
];

const cuisineSlug: Record<string, string> = {
  健康碗: "bowl",
  粉麵: "noodle",
  扒房: "grill",
  素食: "veggie",
  咖啡輕食: "cafe",
  日式定食: "teishoku"
};

function createRestaurant(index: number): Restaurant {
  const district = districtSeeds[index % districtSeeds.length];
  const theme = restaurantThemes[index % restaurantThemes.length];
  const namePart = theme.nameParts[Math.floor(index / districtSeeds.length) % theme.nameParts.length];
  const id = `${cuisineSlug[theme.cuisine] ?? "restaurant"}-${index + 1}`;
  const street = district.streets[index % district.streets.length];
  const latitudeOffset = ((index % 9) - 4) * 0.0017;
  const longitudeOffset = ((Math.floor(index / 9) % 9) - 4) * 0.0017;

  return {
    id,
    name: `${district.district}${namePart}`,
    district: district.district,
    address: `${district.district}${street} ${18 + (index % 180)} 號`,
    cuisine: theme.cuisine,
    price: theme.price,
    rating: Math.round((4.1 + (index % 8) * 0.08) * 10) / 10,
    healthyScore: 82 + (index % 15),
    distanceKm: Math.round((0.4 + (index % 60) * 0.11) * 10) / 10,
    latitude: district.latitude + latitudeOffset,
    longitude: district.longitude + longitudeOffset,
    image: theme.image,
    highlights: theme.highlights,
    menu: theme.menu.map((dish, dishIndex) => ({
      ...dish,
      id: `${id}-dish-${dishIndex + 1}`,
      restaurantId: id
    }))
  };
}

export const restaurants: Restaurant[] = Array.from({ length: 500 }, (_, index) => createRestaurant(index));

export const starterMeals: MealLog[] = [
  {
    ...buildMealLog({
      mealType: "breakfast",
      dishes: [{ dishId: "egg-soy", name: "烚蛋及無糖豆漿", portionMultiplier: 1, calories: 240, protein: 19, carbs: 10, fat: 13 }]
    }),
    id: "m1",
    createdAt: Date.now() - 1000 * 60 * 60 * 7
  },
  {
    ...buildMealLog({
      restaurantId: restaurants[0].id,
      restaurantName: restaurants[0].name,
      mealType: "lunch",
      dishes: [createDishSelection(restaurants[0].menu[1], 1)]
    }),
    id: "m2",
    createdAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

export const demoScanResults: ScanResult[] = [
  { name: "海南雞飯半份飯", calories: 690, protein: 35, carbs: 78, fat: 24, confidence: 86 },
  { name: "三文魚牛油果沙律", calories: 520, protein: 31, carbs: 26, fat: 32, confidence: 91 },
  { name: "叉燒飯走汁", calories: 760, protein: 32, carbs: 96, fat: 26, confidence: 82 }
];

export const starterCompanions: Companion[] = [
  {
    id: "barbie-glow",
    name: "Barbie",
    type: "柔光身形角色",
    personality: "以優雅、健康與自信作為成長方向，會隨着飲食紀錄逐步呈現更明亮的狀態。",
    bodyArchetype: "barbie",
    evolutionStage: 1,
    happiness: 80,
    energy: 76,
    unlockedAccessories: ["珍珠髮帶"],
    palette: ["#FCE7F3", "#F9A8D4"],
    symbol: "B"
  },
  {
    id: "gym-bro",
    name: "Gym Bro",
    type: "力量身形角色",
    personality: "重視蛋白質、訓練感與穩定節奏，身形會隨高蛋白與均衡外食逐步成長。",
    bodyArchetype: "gymBro",
    evolutionStage: 1,
    happiness: 76,
    energy: 86,
    unlockedAccessories: ["晨練毛巾"],
    palette: ["#A7F3D0", "#93C5FD"],
    symbol: "G"
  },
  {
    id: "moku-cloud",
    name: "Moku",
    type: "雲朵療癒寵物",
    personality: "以柔和陪伴為主，會提醒你慢慢進食、好好休息，讓生活節奏保持安定。",
    bodyArchetype: "pet",
    evolutionStage: 1,
    happiness: 82,
    energy: 62,
    unlockedAccessories: ["月光枕頭"],
    palette: ["#DBEAFE", "#FBCFE8"],
    symbol: "M"
  },
  {
    id: "nori-sprout",
    name: "Nori",
    type: "植物精靈寵物",
    personality: "每一次滋養自己的選擇，都會讓牠的房間更溫暖，枝葉也會慢慢成長。",
    bodyArchetype: "spirit",
    evolutionStage: 1,
    happiness: 80,
    energy: 70,
    unlockedAccessories: ["露珠小帽"],
    palette: ["#BBF7D0", "#FED7AA"],
    symbol: "N"
  }
];

export const localFeedItems: FeedItem[] = [
  {
    id: "feed-streak",
    kind: "streak",
    title: "柔光節奏保持中",
    subtitle: "連續回來照顧角色，房間的光線會變得更溫暖。",
    createdAt: Date.now() - 1000 * 60 * 18
  },
  {
    id: "feed-restaurant",
    kind: "restaurant",
    title: "發現一間清爽餐廳",
    subtitle: "之後可以分享給好友，成為安全而溫柔的健康社群動態。",
    createdAt: Date.now() - 1000 * 60 * 55
  },
  {
    id: "feed-meal",
    kind: "meal",
    title: "今日滋養選擇",
    subtitle: "高蛋白、少油、份量剛好，角色看起來更有精神。",
    createdAt: Date.now() - 1000 * 60 * 120
  }
];

export const gentleMissions: GentleMission[] = [
  {
    id: "water-ritual",
    title: "喝一杯水",
    subtitle: "一個很小的開始，也是在照顧自己。",
    kind: "water",
    glowPoints: 18,
    happinessBoost: 4,
    energyBoost: 3,
    roomRewardId: "dew-plant"
  },
  {
    id: "protein-soft-step",
    title: "吃到一份蛋白質",
    subtitle: "不需要完美，只要有一餐是滋養的就很好。",
    kind: "protein",
    glowPoints: 24,
    happinessBoost: 5,
    energyBoost: 6,
    roomRewardId: "skincare-shelf"
  },
  {
    id: "short-walk",
    title: "走一小段路",
    subtitle: "陪角色呼吸一下，三分鐘也值得被記住。",
    kind: "walk",
    glowPoints: 20,
    happinessBoost: 5,
    energyBoost: 5,
    roomRewardId: "latte-lamp"
  },
  {
    id: "nourishing-meal",
    title: "選一餐滋養自己的食物",
    subtitle: "清爽、暖胃、舒服，選一樣已經足夠。",
    kind: "nourish",
    glowPoints: 26,
    happinessBoost: 6,
    energyBoost: 5,
    roomRewardId: "cloud-rug"
  }
];

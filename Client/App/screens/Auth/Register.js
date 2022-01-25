import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { color, efecolor, errorColor } from "../../constanst";
import { useHttpClient } from "../../hooks/http-hook";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

const SignInScreen = ({ navigation }) => {
  const { isLoading, error, registerUser } = useHttpClient();
  const [image, setImage] = useState(null);

  const openImageOptions = () => {
    Alert.alert(
      "Profile Select",
      "Select photo from image gallery or take one now",
      [
        {
          text: "Cancel",
        },
        {
          text: "Camera",
          onPress: () => {
            selectFile("camera");
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            selectFile("gallery");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const selectFile = async (option) => {
    try {
      if (option === "gallery") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") return;
        openPicker(option);
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== "granted") return;
        openPicker(option);
      }
    } catch (e) {}

    // try {
    //   const info = {
    //     title: "Chat App Camera Permissions",
    //     message: "Chat App need your permission to access your gallery",
    //     buttonNeutral: "Ask Me Later",
    //     buttonNegative: "Cancel",
    //     buttonPositive: "OK",
    //   };
    //   let permission =
    //     option === "gallery"
    //       ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    //       : PermissionsAndroid.PERMISSIONS.CAMERA;
    //   const granted = await PermissionsAndroid.requestMultiple(
    //     [
    //       // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       //PermissionsAndroid.PERMISSIONS.CAMERA,
    //       permission,
    //     ],
    //     info
    //   );
    //   openPicker(option);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   } else {
    //     console.log(granted);
    //     console.log("Camera permission denied");
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  const openPicker = async (option) => {
    let result = null;

    if (option === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }
    if (result && !result.cancelled) {
      let newFile = {
        uri: result.uri,
        type: `test/${result.uri.split(".")[1]}`,
        name: `${Date.now()}.${result.uri.split(".")[1]}`,
      };
      setImage(newFile);
    }
  };

  const validation = yup.object().shape({
    phone: yup
      .string("Only numbers are allowed")
      .trim()
      .required("Phone is reguired")
      .min(5, "Phone should be more than 5 characters")
      .max(10, "Phone not greater than 10 chars."),
    password: yup
      .string()
      .trim()
      .min(5, "Password should be more than 5 characters")
      .max(30, "Password should not excced 30 characters")
      .required("Password is required"),
    username: yup
      .string("Only alphabets are allowed")
      .trim()
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed")
      .min(3, "Username should be more than 3 characters")
      .max(20, "Username should not excced 20 chars.")
      .required("Username is required"),
    email: yup
      .string("Only alphabets are allowed")
      .email("Please enter a valid email")
      .required("Email is required"),
  });

  const registerHandler = (values) => {
    if (!image) {
      Alert.alert("Warning", "Please select an image");
      return;
    }
    values.image = image;
    try {
      registerUser(values);
    } catch (err) {
      Alert.alert("Error", "An unexpected error occured");
    }
  };

  return (
    <Formik
      initialValues={{ phone: "", password: "", username: "", email: "" }}
      onSubmit={(values) => registerHandler(values)}
      validationSchema={validation}
    >
      {({ handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
        <View style={styles.container}>
          <StatusBar backgroundColor={color} barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.text_header}>Register</Text>
          </View>
          <View style={styles.footer}>
            <ScrollView>
              <View style={styles.inputContainer}>
                <Text style={styles.text_footer}>Full name</Text>
                <View style={styles.action}>
                  <Ionicons name="person-outline" size={20} color={color} />
                  <TextInput
                    placeholder="Your full name"
                    style={styles.textInput}
                    onChangeText={handleChange("username")}
                    onBlur={() => setFieldTouched("username")}
                  />
                </View>
              </View>
              {touched.username && errors.username && (
                <Text style={styles.errorMsg}>{errors.username}</Text>
              )}
              <View style={styles.inputContainer}>
                <Text style={[styles.text_footer]}>Phone</Text>
                <View style={styles.action}>
                  <Ionicons name="call-outline" size={20} color={color} />
                  <TextInput
                    placeholder="Your Phone"
                    keyboardType="numeric"
                    style={styles.textInput}
                    onChangeText={handleChange("phone")}
                    onBlur={() => setFieldTouched("phone")}
                  />
                </View>
              </View>
              {touched.phone && errors.phone && (
                <Text style={styles.errorMsg}>{errors.phone}</Text>
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                  <Ionicons name="mail-outline" size={20} color={color} />
                  <TextInput
                    placeholder="Your Email"
                    style={styles.textInput}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                  />
                </View>
              </View>

              {touched.email && errors.email && (
                <Text style={styles.errorMsg}>{errors.email}</Text>
              )}
              <View style={styles.inputContainer}>
                <Text style={[styles.text_footer]}>Password</Text>
                <View style={styles.action}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={color}
                  />
                  <TextInput
                    placeholder="Your Password"
                    style={styles.textInput}
                    onChangeText={handleChange("password")}
                    onBlur={() => setFieldTouched("password")}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorMsg}>{errors.password}</Text>
              )}
              <View style={styles.imageSelectContainer}>
                <TouchableOpacity
                  onPress={openImageOptions}
                  style={[
                    styles.imageSelector,
                    {
                      borderColor: color,
                      borderWidth: 1,
                      marginTop: 15,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: color,
                      },
                    ]}
                  >
                    Select profile image
                  </Text>
                </TouchableOpacity>
                {image && (
                  <Image source={{ uri: image.uri }} style={styles.image} />
                )}
              </View>

              {error && <Text style={styles.httpError}>{error}</Text>}

              {isLoading ? (
                <View style={styles.button}>
                  <ActivityIndicator size="large" color={color} />
                </View>
              ) : (
                <View style={styles.button}>
                  <TouchableOpacity
                    style={styles.signIn}
                    onPress={handleSubmit}
                  >
                    <LinearGradient
                      colors={[color, efecolor]}
                      style={styles.signIn}
                    >
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: "#fff",
                          },
                        ]}
                      >
                        Register
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                      styles.signIn,
                      {
                        borderColor: color,
                        borderWidth: 1,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: color,
                        },
                      ]}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 13,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    bottom: 10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: color,
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: color,
    paddingBottom: 5,
  },
  inputContainer: {
    paddingBottom: 10,
  },
  image: { width: 70, height: 70, borderRadius: 100, marginLeft: 10 },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: color,
  },
  button: {
    alignItems: "center",
    marginTop: 20,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  imageSelector: {
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  imageSelectContainer: {
    flexDirection: "row",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMsg: {
    color: errorColor,
    fontSize: 14,
  },
  httpError: {
    color: errorColor,
    fontSize: 17,
    paddingTop: 20,
  },
});

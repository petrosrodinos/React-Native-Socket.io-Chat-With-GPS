import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as yup from "yup";
import { color, efecolor, errorColor } from "../../constanst";
import { useHttpClient } from "../../hooks/http-hook";
import { Ionicons } from "@expo/vector-icons";

const SignInScreen = ({ navigation }) => {
  const { isLoading, error, loginUser } = useHttpClient();

  const validation = yup.object().shape({
    phone: yup
      .string("Only numbers allowed")
      .required("Phone is reguired")
      .min(5, "Phone must be at least 5 characters")
      .max(10, "Phone not greater than 10 chars."),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  const loginHandler = (values) => {
    try {
      loginUser(values);
    } catch (err) {
      Alert.alert("Error", "An unexpected error occured");
    }
  };

  return (
    <Formik
      initialValues={{ phone: "", password: "" }}
      onSubmit={(values) => loginHandler(values)}
      validationSchema={validation}
    >
      {({ handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
        <View style={styles.container}>
          <StatusBar backgroundColor={color} barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.text_header}>Log In</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.text_footer, {}]}>Phone</Text>
            <View style={styles.action}>
              <Ionicons name="call-outline" size={20} color={color} />
              <TextInput
                keyboardType="numeric"
                placeholder="Your Phone"
                placeholderTextColor="grey"
                style={styles.textInput}
                onChangeText={handleChange("phone")}
                onBlur={() => setFieldTouched("phone")}
              />
            </View>
            {touched.phone && errors.phone && (
              <Text style={styles.errorMsg}>{errors.phone}</Text>
            )}
            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 35,
                },
              ]}
            >
              Password
            </Text>

            <View style={styles.action}>
              <Ionicons name="lock-closed-outline" size={20} color={color} />
              <TextInput
                placeholder="Your Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                style={styles.textInput}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
              />
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorMsg}>{errors.password}</Text>
            )}
            {error && <Text style={styles.httpError}>{error}</Text>}
            {isLoading ? (
              <View style={styles.button}>
                <ActivityIndicator size="large" color={color} />
              </View>
            ) : (
              <View style={styles.button}>
                <TouchableOpacity style={styles.signIn} onPress={handleSubmit}>
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
                      Log in
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
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
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    top: -50,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    bottom: 50,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 70,
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
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: color,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: color,
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
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

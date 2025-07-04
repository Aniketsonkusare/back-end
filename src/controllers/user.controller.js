import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user Details from Front-end
  // validation - not empty
  // check if user is already exist: username,email
  // check for images, check for avatar
  // upload them cloudinary, avatar
  // create user Object - create entry in db
  // remove password and refresh token fields from response
  // check if user creation
  // return res

  const {username, fullName, email, password} = req.body;
  console.log("Email:", email);

  if (
    [username, fullName, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const existedUser = await User.findOne({
    $or: [{username}, {email}],
  });

  if (existedUser) {
    throw new ApiError(409, "User with userName or Email already Exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  console.log(avatarLocalPath, "avatarLocalPath");
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req?.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0]?.path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar local File Path is Required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(coverImage?.url,"hfhdsfhslfhdlkg")

  if (!avatar) {
    throw new ApiError(400, "Avatar File is Required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went Wrong while register the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

export {registerUser};
